import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import { PassesService } from './passes.service';
import {PassQueryParams} from "./passes.types";
import {Request, Response} from "express";

@Controller('passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @Get('pass')
  async createPass(
    @Query() query: PassQueryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    let pass;
    const passName =
      'test_pass' +
      '_' +
      new Date().toISOString().split('T')[0];

    try {
        pass = await this.passesService.createPass(query);

      if (!pass) {
        response.status(400);
        response.statusMessage = 'The pass wasn\'t generated. Please check query parameters.';

        response.set({
          'Content-type': 'application/json',
        });

        response.send();

        return;
      }

      // Создание потока .pkpass
      const stream = pass.getAsStream();

      response.set({
        'Content-type': pass.mimeType,
        'Content-disposition': `attachment; filename=${passName}.pkpass`,
      });

      stream.pipe(response);
    } catch (err) {
      console.log(err);

      response.set({
        'Content-type': 'text/html',
      });

      response.send(err.message);
    }
  }
}
