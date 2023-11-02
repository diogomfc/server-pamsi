import { Router } from 'express';

import { form1ClienteSeguradoRoutes } from './form1-cliente-segurado.routes';
import { form2CaracteristicaSinistroRoutes } from './form2-caracteristica-sinistro.routes';
import { form3CronologiaSinistroRoutes } from './form3-cronologia-sinistro.routes';
import { form4DoCarregamentoRoutes } from './form4_Do_Carregamento.routes';

export const formRoutes = Router();

// Rota de formularios
formRoutes.use('/form1-cliente-segurado', form1ClienteSeguradoRoutes);
formRoutes.use('/form2-caracteristica-sinistro', form2CaracteristicaSinistroRoutes);
formRoutes.use('/form3-cronologia-sinistro', form3CronologiaSinistroRoutes);
formRoutes.use('/form4-do-carregamento', form4DoCarregamentoRoutes);





