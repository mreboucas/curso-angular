import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidarCamposService } from '../validar-campos.service';
import { Input } from '@angular/core';

@Component({
  selector: 'dio-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.scss']
})
export class InputTextAreaComponent implements OnInit {

  @Input() titulo: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;

  constructor(public validacao: ValidarCamposService) { }

  ngOnInit() {
  }

  get formControl(): AbstractControl {
    return this.formGroup.controls[this.controlName];
  }

}
