import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ValidationError } from '@nestjs/common';
export interface ValidatePipeOptioins extends ValidatorOptions {
  tranform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}
