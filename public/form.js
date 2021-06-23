let errList = [
    "Заполните поле",
    "Поле заполнено не верно",
]

let patternList = {
    name: '^[a-z]+$',
    phone: '\\+7\\([0-9]{3}\\)[0-9]{3}-[0-9]{4}',
    email: '^[a-zA-Z-.]+@[a-z]+\\.[a-z]{2,4}$',
    textarea: '[a-z0-9-._]*'
}

class FormValidate{
    constructor(form, err, pattern) {
        this.form = document.querySelector(form);
        this.elements = this.form.querySelectorAll('.input-field');
        this.err = err;
        this.pattern = pattern;
    }

    init() {
        for (const el of this.elements) {
            el.firstElementChild.addEventListener('focus', (evt) => {
                evt.target.value = '';
                evt.target.style.borderBottomColor = 'inherit';
            })
        }

        this.form.addEventListener('submit', evt => {
            evt.preventDefault();
            for (const el of this.elements) {
                this.validateEl(el.firstElementChild);
            }
        })

    }

    validateEl(el) {
        const regExp = new RegExp(this.pattern[el.dataset.name], 'gi');
        
        if (el.value === '') {
            this.error(el, this.err[0]);
        } else {
            let val = regExp.test(el.value);
            if (!val) {
                this.error(el, this.err[1]);
            }
        }
    }

    error(elem, text) {
        elem.style.borderBottomColor = 'red';
        const p = document.createElement('p');
        p.classList.add('err-text')
        p.innerText = text;
        p.style.color = 'red';
        elem.insertAdjacentElement('afterend', p);
        setTimeout(() => {
            elem.nextElementSibling.innerText = '';
        }, 3000);
    }
}

const form = new FormValidate('form', errList, patternList).init();


const str = `Two: 'I'm doing alright. How about you?'`;

console.log(str.slice(5).replace(/^'|'$/gm, '"'));


