import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

interface ComplexityOptions {
  min?: number;
  max?: number;
  lowerCase?: boolean;
  upperCase?: boolean;
  numeric?: boolean;
  symbols?: boolean;
}

const defaultOptions = {
  min: 8,
  max: 50,
  lowerCase: true,
  upperCase: true,
  numeric: true,
  symbols: true,
} as ComplexityOptions;

@Injectable()
export class PasswordComplexityService {
  readonly complexityOption = defaultOptions;
  constructor(private readonly configService: ConfigService) {
    const customMin = this.configService.get('PASSWORD_MIN');
    const customMax = this.configService.get('PASSWORD_MAX');
    const hasLowerCase = this.configService.get('PASSWORD_HAS_LOWERCASE');
    const hasUpperCase = this.configService.get('PASSWORD_HAS_UPPERCASE');
    const hasNumerics = this.configService.get('PASSWORD_HAS_NUMERICS');
    const hasSymbols = this.configService.get('PASSWORD_HAS_SYMBOLS');
    if (!isNaN(parseInt(customMin))) {
      this.complexityOption.min = customMin;
    }
    if (!isNaN(parseInt(customMax))) {
      this.complexityOption.max = customMax;
    }

    const booleanOptions = ['true', 'false'];
    if (
      typeof hasLowerCase === 'string' &&
      booleanOptions.some((b) => b === hasLowerCase)
    ) {
      this.complexityOption.lowerCase = !!hasLowerCase;
    }
    if (
      typeof hasUpperCase === 'string' &&
      booleanOptions.some((b) => b === hasUpperCase)
    ) {
      this.complexityOption.upperCase = !!hasUpperCase;
    }
    if (
      typeof hasNumerics === 'string' &&
      booleanOptions.some((b) => b === hasNumerics)
    ) {
      this.complexityOption.numeric = !!hasNumerics;
    }
    if (
      typeof hasSymbols === 'string' &&
      booleanOptions.some((b) => b === hasSymbols)
    ) {
      this.complexityOption.symbols = !!hasSymbols;
    }
  }

  public validate(password: string): Joi.ValidationResult<string> {
    let validator = Joi.string();
    if (this.complexityOption.min) {
      validator = validator.min(this.complexityOption.min);
    }
    if (this.complexityOption.max) {
      validator = validator.max(this.complexityOption.max);
    }
    let patterns;
    if (this.complexityOption.lowerCase) {
      patterns = '(?=.*[a-z])';
    }
    if (this.complexityOption.upperCase) {
      if (patterns) {
        patterns = '(?=.*[a-zA-Z])';
      } else {
        patterns = '(?=.*[A-Z])';
      }
    }
    if (this.complexityOption.numeric) {
      patterns += '(?=.*[0-9])';
    }
    if (this.complexityOption.symbols) {
      // " !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"
      patterns += '(?=.*[s!"#$%&()*+,])';
    }
    if (patterns) {
      validator = validator.regex(new RegExp(patterns));
    }
    return validator.validate(password);
  }
}
