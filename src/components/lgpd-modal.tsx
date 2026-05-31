import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

export function LgpdModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <button className="text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline text-xs">
            Política de Privacidade
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg font-display">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Política de Privacidade — LGPD
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-5 text-sm text-muted-foreground pr-4">
            <p className="text-foreground font-medium">
              A KebraGalho valoriza a sua privacidade e está comprometida em proteger os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>

            <section>
              <h3 className="font-semibold text-foreground mb-1">1. Quem somos</h3>
              <p>
                KebraGalho é uma plataforma digital que conecta pessoas que precisam de serviços a prestadores qualificados. Ao utilizar nossos serviços, você confia dados pessoais à nossa empresa, e temos a responsabilidade de protegê-los.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">2. Dados que coletamos</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Dados de cadastro:</strong> nome completo, e-mail, telefone, CPF, data de nascimento, endereço (cidade, bairro, logradouro).</li>
                <li><strong>Dados de uso:</strong> histórico de solicitações, interações com prestadores, avaliações e feedbacks.</li>
                <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, dispositivo, cookies e dados de navegação.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">3. Finalidade do tratamento</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Viabilizar a conexão entre solicitantes e prestadores de serviços.</li>
                <li>Enviar comunicações sobre solicitações, orçamentos e atualizações da plataforma.</li>
                <li>Garantir a segurança, prevenir fraudes e cumprir obrigações legais.</li>
                <li>Melhorar a experiência do usuário e desenvolver novas funcionalidades.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">4. Base legal</h3>
              <p>
                Tratamos seus dados com base no consentimento livre, específico e informado (Art. 7º, I, LGPD), na execução de contrato (Art. 7º, V) e no legítimo interesse (Art. 7º, IX), sempre respeitando os seus direitos.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">5. Compartilhamento de dados</h3>
              <p>
                Seus dados são compartilhados apenas com prestadores de serviços quando você solicita um orçamento ou contrata um serviço, e com parceiros tecnológicos essenciais para o funcionamento da plataforma (hospedagem, notificações, análise de dados). Nunca vendemos dados a terceiros.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">6. Segurança da informação</h3>
              <p>
                Utilizamos criptografia, acesso restrito, monitoramento contínuo e boas práticas de segurança para proteger seus dados contra acessos não autorizados, vazamentos ou destruição.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">7. Seus direitos (Art. 18, LGPD)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Confirmar a existência de tratamento dos seus dados.</li>
                <li>Acessar seus dados e solicitar cópia.</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>Revogar o consentimento a qualquer momento.</li>
                <li>Solicitar portabilidade dos dados a outro serviço.</li>
              </ul>
              <p className="mt-2">
                Para exercer seus direitos, envie um e-mail para <a href="mailto:privacidade@kebragalho.com.br" className="text-primary hover:underline">privacidade@kebragalho.com.br</a> com o assunto "Solicitação LGPD".
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">8. Cookies e tecnologias de rastreamento</h3>
              <p>
                Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para entender como você interage com o site. Você pode gerenciar as preferências de cookies diretamente no seu navegador.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">9. Retenção de dados</h3>
              <p>
                Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política e para atender obrigações legais (como prazos fiscais e contratuais). Após esse período, os dados são anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">10. Alterações nesta política</h3>
              <p>
                Esta política pode ser atualizada periodicamente. Notificaremos você sobre alterações significativas por e-mail ou por meio de avisos na plataforma. Recomendamos revisar esta página regularmente.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">11. Contato</h3>
              <p>
                Dúvidas sobre esta política ou sobre o tratamento dos seus dados? Fale conosco pelo e-mail <a href="mailto:privacidade@kebragalho.com.br" className="text-primary hover:underline">privacidade@kebragalho.com.br</a>.
              </p>
            </section>

            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Última atualização: maio de 2026.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
