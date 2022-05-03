import User from '../../database/models/User';
import Company from '../../database/models/Company';
import Address from '../../database/models/address/Address';

class UserRepository {
  async findByPk(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password_hash'],
      },
    });
    return user;
  }

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async createUserAndCompany(req) {
    const address = await Address.create(req.body.company.address);
    const company = await Company.create({
      ...req.body.company,
      addressId: address.id,
    });

    const user = await User.create({
      ...req.body,
      companyId: company.id,
      isAdmin: true,
    });

    delete user.password_hash;

    return user;
  }
}

export default UserRepository;