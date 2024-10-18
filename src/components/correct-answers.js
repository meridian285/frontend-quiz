import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers {
    constructor() {
        this.answers = null;
        this.questionTitleTest = null;
        this.testId = localStorage.getItem('testId');
        this.result = null;

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();

        try {
            this.result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + userInfo.userId);

            //Не совсем понимаю какие тут проверки делать
            // if (!this.result || !this.result.test.id || !this.result.test.name || !this.result.test.questions) {
            //     if (this.result && !this.result.id && !this.result.name && !this.result.questions) {
            //         throw new Error('Что-то пошло не так');
            //     }
            //     this.showQuestions();
            // }

            if (this.result) {
                this.showQuestions();
            }
        } catch (error) {
            console.log(error)
        }
    }

    showQuestions() {

        this.questionTitleTest = document.querySelector('.test-result_title');
        this.questionsTest = document.querySelector('.questions')
        this.questionTitleTest.innerText = this.result.test.name;


        const credential = JSON.parse(localStorage.getItem('userInfo'));

        document.getElementById('fullName').textContent = credential.fullName + ', ';
        document.getElementById('email').textContent = credential.email;


        this.result.test.questions.forEach((item, index) => {
            const testResultAnswers = document.createElement("div");
            testResultAnswers.className = 'test-result-answers';

            this.questionsTest.appendChild(testResultAnswers);

            testResultAnswers.innerHTML = `
                        <div class="test-question">
                            <div class="test-question-title" id=title-${index + 1}>
                                <span>Вопрос ${index + 1}:</span> ${item.question}
                            </div>
                        </div>
                        `;

            const testQuestionOptions = document.createElement("div");
            testQuestionOptions.className = 'test-question-options'

            item.answers.forEach(item => {

                const testQuestionOption = document.createElement("div");
                testQuestionOption.className = 'test-question-option';

                const inputId = `${item.id}`;
                const input = document.createElement("input");
                input.type = 'radio';
                input.id = inputId;
                input.name = 'name';

                const label = document.createElement("label");
                label.setAttribute('for', inputId);
                label.innerHTML = item.answer;


                if (item.correct) {
                    input.style.borderWidth = '6px';
                    input.style.borderColor = '#5FDC33';
                    label.style.color = '#5FDC33';
                }

                if (item.correct === false) {
                    input.style.borderWidth = '6px';
                    input.style.borderColor = '#DC3333';
                    label.style.color = '#DC3333';
                }

                testQuestionOption.appendChild(input);
                testQuestionOption.appendChild(label);

                testQuestionOptions.appendChild(testQuestionOption);
                testResultAnswers.appendChild(testQuestionOptions);
            })
        })
    }
}


