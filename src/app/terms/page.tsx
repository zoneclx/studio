
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8 animate-fade-in-up text-center">
        <FileText className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-4xl font-bold font-display mt-4">Terms of Service</h1>
        <p className="text-muted-foreground mt-2 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-6 md:p-8">
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. Agreement to Terms</h2>
                <p>
                  By using our application, Byte AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application. We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. Use of the Service</h2>
                <p>
                  You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content, asking for personally identifiable information, or otherwise.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. Intellectual Property Rights</h2>
                <p>
                  The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. Disclaimer of Warranties</h2>
                <p>
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. The Company makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. Limitation of Liability</h2>
                <p>
                  IN NO EVENT WILL THE COMPANY, ITS AFFILIATES OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE WEBSITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">6. Governing Law</h2>
                <p>
                  All matters relating to the Service and these Terms and any dispute or claim arising therefrom or related thereto shall be governed by and construed in accordance with the internal laws of the State of California without giving effect to any choice or conflict of law provision or rule.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact Us</h2>
                <p>
                  If you have questions or comments about these Terms of Service, please contact us at: enzogimena.business@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
