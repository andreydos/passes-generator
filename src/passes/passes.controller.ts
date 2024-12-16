import { Controller, Get, Req, Res } from '@nestjs/common';
import { PassesService } from './passes.service';

@Controller('passes')
export class PassesController {
  constructor(private readonly passesService: PassesService) {}

  @Get('create')
  async createPass(@Res() response, @Req() request) {
    const passName =
      'test_pass' +
      '_' +
      new Date().toISOString().split('T')[0];

    try {
      const pass = await this.passesService.createPass(request);
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
