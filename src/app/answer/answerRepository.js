import Answer from '../../database/models/Answer';
import Question from '../../database/models/Question';

class AnswerRepository {
  async listAnswers(companyId) {
    const results = await Question.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['section', 'ASC']],
      include: [
        {
          model: Answer,
          as: 'answers',
          where: { companyId },
          required: false,
          attributes: ['id', 'answer', 'answerVersion'],
          order: [['answerVersion', 'DESC']],
          limit: 1,
        },
      ],
    });

    const formattedResult = new Map();

    results.forEach(result => {
      const formatedObject = {
        options: result.options,
        id: result.id,
        question: result.question,
        answer: (result.answers[0] || {}).answer || null,
      };

      if (formattedResult.has(result.section)) {
        const existingValues = formattedResult.get(result.section);
        formattedResult.set(result.section, [
          ...existingValues,
          formatedObject,
        ]);
      } else {
        formattedResult.set(result.section, [formatedObject]);
      }
    });

    const iteratorResult = formattedResult[Symbol.iterator]();

    const finalResult = [];

    /* eslint-disable no-restricted-syntax */
    for (const item of iteratorResult) {
      console.log(item);
      finalResult.push({
        section: item[0],
        questions: item[1],
      });
    }

    return finalResult;
  }

  async updateAnswers(req) {
    const { body, params } = req;

    // O auto incremento do answer_version esta no banco
    const result = await Answer.bulkCreate(
      body.responses.map(r => ({
        ...r,
        companyId: params.companyId,
        userId: 1,
      }))
    );

    return result;
  }
}

export default AnswerRepository;
