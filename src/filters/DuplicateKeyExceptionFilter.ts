import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class DuplicateKeyExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    if (exception.code === 11000) {
      // Determine the duplicate field from the error message
      const duplicateField = extractDuplicateFieldFromError(exception);

      // Handle the duplicate key error based on the duplicate field
      const response = host.switchToHttp().getResponse();
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `User with this ${duplicateField} already exists`,
      });
    }
  }
}

// This function extracts the duplicate field from the MongoDB error message
function extractDuplicateFieldFromError(exception: MongoError): string {
  const errorMessage = exception.message;
  const duplicateFieldStart =
    errorMessage.indexOf('index: ') + 'index: '.length;
  const duplicateFieldEnd = errorMessage.indexOf('_1', duplicateFieldStart);
  return errorMessage.substring(duplicateFieldStart, duplicateFieldEnd);
}
