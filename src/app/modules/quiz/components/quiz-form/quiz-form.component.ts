import { Component, OnInit } from '@angular/core';
import { Compozer, TextboxCompozerComponent } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss']
})
export class QuizFormComponent implements OnInit {

  public compozerComponent: Compozer = new Compozer([
    [
      {
        compozerType: 'html',
        value: '<h1>Mon Titre</h1><img src="http://res.cloudinary.com/umi/image/upload/v1506515143/Application/logo-umi.png" alt="">'
      },
      {
        compozerType: 'content',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
        'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
        'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt' +
        ' mollit anim id est laborum.'
      }
    ],
    [
      new TextboxCompozerComponent({
        key: 'data1',
        label: 'Do you know this market sector?',
        classAddition: 's6'
      }),
      {
        questionType: 'textbox',
        key: 'data1',
        label: 'Do you know this market sector?',
        classAddition: 's6'
      },
      {
        questionType: 'textbox',
        key: 'data1',
        label: 'Do you know this market sector?',
        classAddition: 's8'
      },
      {
        questionType: 'textbox',
        key: 'data1',
        label: 'Do you know this market sector?',
        classAddition: 's4'
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data2',
        label: 'Is the issue relevant in the market sector?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data3',
        label: 'Is this an appropriate solution to the issue?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data4',
        label: 'How does this product compare to other existing solutions?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data5',
        label: 'Do you know any competitors?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data6',
        label: 'Do you see any other possible applications?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data7',
        label: 'What is the market potential in this sector?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data8',
        label: 'What is an acceptable acquisition cost for the product?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data9',
        label: 'Strengths?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data10',
        label: 'Weaknesses?',
      }
    ],
    [
      {
        questionType: 'textbox',
        key: 'data11',
        label: 'Do you know potential partners?',
      }
    ]
  ]);

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  onSubmit(form) {
    alert('TODO Submitted quiz');
  }
}
