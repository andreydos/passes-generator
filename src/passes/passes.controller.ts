import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import { PassesService } from './passes.service';
import {CreatePassBody} from "./passes.types";
import {Request, Response} from "express";

@Controller('passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @Post('create')
  async createPass(
    @Body() body: CreatePassBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    let pass;
    const passName =
      'test_pass' +
      '_' +
      new Date().toISOString().split('T')[0];

    try {
      if (body.type === 'SUBSCRIPTION') {
        pass = await this.passesService.createTransportSubscriptionPass(body.data);
      } else {
        response.status(400);
        response.statusMessage = 'Type must be: SUBSCRIPTION';

        response.set({
          'Content-type': 'application/json',
        });

        response.send('Type must be: SUBSCRIPTION');

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
