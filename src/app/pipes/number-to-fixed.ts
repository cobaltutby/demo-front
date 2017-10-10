import { Pipe, PipeTransform } from '@angular/core';
import * as Classes from '../classes/classes';

@Pipe({ name: 'number_to_fixed' })

export class NumberToFixedPipe implements PipeTransform {

  transform(number: number, to_fixed: number) {
    if (number || number === 0) {
      to_fixed = to_fixed || 2;

      return number.toFixed(to_fixed)
    }
    return null
  }

}
