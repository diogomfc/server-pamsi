import { Router } from 'express';

import { form1ClienteSeguradoRoutes } from './form1-cliente-segurado.routes';
import { form2CaracteristicaSinistroRoutes } from './form2-caracteristica-sinistro.routes';
import { form3CronologiaSinistroRoutes } from './form3-cronologia-sinistro.routes';
import { form4DoCarregamentoRoutes } from './form4-do-carregamento.routes';
import { form5MotoristaRoutes } from './form5-motorista.rutes';
import { form6AjudantesRoutes } from './form6-ajudantes.routes';
import { form7VeiculoTransportadorRoutes } from './form7-veiculo-transportador.routes';
import { form8OrgaoPolicialRoutes } from './form8-orgao-policial.routes';
import { form9GerenciamentoRiscoRoutes } from './form9-gerenciamento.routes';
import { form10SistemasProtecaoCarregamentoRoutes } from './form10-sistemas-protecao-carregamento.routes';
import { form11DeclaracaoMotoristaAjudanteRoutes } from './form11-declaracao-motorista-ajudante.routes';
import { form12GerenciamentoRiscoDepositoRoutes } from './form12-gerenciamento-risco-deposito.routes';
import { form13LocaisEventoRoutes } from './form13-locais-evento.routes';
import { form14ResumoAveriguacoesRoutes } from './form14-resumo-averiguacoes.routes';
import { form15RecuperacaoCargaRoutes } from './form15-recuperacao-carga.routes';

import { arquivoRoutes } from './arquivo.routes';
import { form16AnexosFotograficosRoutes } from './form16-anexos-fotograficos.routes';
import { form17ConclusaoRoutes } from './form17-conclusao.routes';

export const formRoutes = Router();
// Rota de formularios
formRoutes.use('/form1-cliente-segurado', form1ClienteSeguradoRoutes);
formRoutes.use('/form2-caracteristica-sinistro', form2CaracteristicaSinistroRoutes);
formRoutes.use('/form3-cronologia-sinistro', form3CronologiaSinistroRoutes);
formRoutes.use('/form4-do-carregamento', form4DoCarregamentoRoutes);
formRoutes.use('/form5-motorista', form5MotoristaRoutes);
formRoutes.use('/form6-ajudantes', form6AjudantesRoutes);
formRoutes.use('/form7-veiculo-transportador', form7VeiculoTransportadorRoutes);
formRoutes.use('/form8-orgao-policial', form8OrgaoPolicialRoutes);
formRoutes.use('/form9-gerenciamento-risco', form9GerenciamentoRiscoRoutes);
formRoutes.use('/form10-sistemas-protecao-carregamento', form10SistemasProtecaoCarregamentoRoutes);
formRoutes.use('/form11-declaracao-motorista-ajudante', form11DeclaracaoMotoristaAjudanteRoutes);
formRoutes.use('/form12-gerenciamento-risco-deposito', form12GerenciamentoRiscoDepositoRoutes);
formRoutes.use('/form13-locais-evento', form13LocaisEventoRoutes);
formRoutes.use('/form14-resumo-averiguacoes', form14ResumoAveriguacoesRoutes);
formRoutes.use('/form15-recuperacao-carga', form15RecuperacaoCargaRoutes);
formRoutes.use('/form16-anexos-fotograficos', form16AnexosFotograficosRoutes);
formRoutes.use('/form17-conclusao', form17ConclusaoRoutes);

//Rotas de arquivos
formRoutes.use('/upload/arquivo', arquivoRoutes);





