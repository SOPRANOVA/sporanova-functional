# Project TODO

- [x] Estrarre e analizzare il frontend esportato, censendo route, pagine, componenti, interazioni e dati simulati.
- [x] Produrre la mappa verificabile schermata → azione → regola → dati → API → permessi → stato UI, incluse le assunzioni.
- [x] Verificare schermata per schermata l’allineamento finale al frontend allegato con una sessione autenticata e documentare le eventuali differenze UI residue.
- [x] Definire schema dati normalizzato, multi-tenant e migrabile per organizzazioni, workspace, membership, agenti, conversazioni, sorgenti dati, documenti, automazioni, notifiche e audit log.
- [x] Verificare l’isolamento tenant con middleware server-side e test di accesso cross-workspace, dopo la migrazione versionata già applicata.
- [x] Implementare RBAC server-side estendibile per Owner, Admin, Member e Viewer nel flusso di autenticazione esistente.
- [x] Implementare API tRPC modulari con validazione, autorizzazione, risposte ed errori coerenti, logging strutturato e health check.
- [x] Implementare dashboard e analytics server-side con intervalli, filtri, aggregazione, ordinamento e paginazione.
- [x] Implementare agenti, esecuzioni tracciabili, conversazioni persistenti e ricerca della cronologia nel workspace autorizzato.
- [x] Completare un connettore data source HTTP reale, gestione cifrata delle credenziali e pipeline di sincronizzazione asincrona prima di attivare sorgenti esterne.
- [x] Completare data source, documenti e file con metadati, stato, controllo accessi, validazione, cancellazione sicura e connettore HTTP sincronizzato.
- [x] Implementare automazioni, notifiche persistenti e audit log per le azioni sensibili evidenziate dal frontend.
- [x] Completare la sostituzione dei controlli non operativi delle integrazioni esterne con flussi configurati o nasconderli fino alla configurazione.
- [x] Eseguire la verifica visiva autenticata delle principali schermate app e rifinire eventuali differenze dall’interfaccia allegata.
- [x] Estendere i test Vitest ai flussi applicativi agenti, intelligence, workflow, notifiche, analytics e frontend/backend oltre alla copertura già presente di authz, salute e upload.
- [x] Preparare seed di sviluppo, configurazione ambienti, documentazione API, architettura, migrazioni e istruzioni di distribuzione.
- [x] Verificare i percorsi autenticati principali con la sessione di sviluppo e testare la readiness delle route OAuth indipendenti; la prova end-to-end del provider OAuth richiede le credenziali dell’ambiente di destinazione.
- [x] Eseguire un audit completo delle dipendenze Manus nel codice, nelle dipendenze, negli script e nella configurazione runtime.
- [x] Sostituire il runtime Manus con un backend SOPRANOVA portabile e configurato esclusivamente tramite variabili d’ambiente proprietarie.
- [x] Sostituire l’autenticazione OAuth Manus con un’architettura indipendente per password, sessioni, OAuth e RBAC.
- [x] Sostituire database, storage, AI e notifiche Manus con adapter indipendenti e provider configurabili.
- [x] Estendere la coda e il worker autonomi, già operativi per le esecuzioni agente, a elaborazione documenti, sincronizzazioni data source e workflow eseguibili; le pianificazioni provider-specifiche restano deliberate come integrazione esterna opzionale e sono documentate.
- [x] Predisporre un file di configurazione template completo, senza credenziali, e un percorso di configurazione locale/produttivo portabile.
- [x] Isolare o eliminare framework, endpoint, environment variable e pacchetti Manus dalla build di produzione.
- [x] Preparare sviluppo locale, backup database, migrazioni, seed e istruzioni di deploy indipendenti dal provider.
- [x] Eseguire il test di portabilità e l’audit finale per attestare l’assenza di dipendenze runtime da Manus.

- [x] مطابقة صفحات الموقع العامة وصفحات الدخول حرفيًا مع واجهة الملف المرفق، من دون إعادة تصميم أو تحسينات بصرية إضافية.
- [x] مقارنة التخطيط والألوان والخطوط والمسافات والمكونات وصفحات التطبيق المحمية الأصلية صفحة بصفحة بعد الدخول بجلسة حقيقية.
- [x] التقاط لقطات تحقق لكل صفحات الموقع العامة وصفحات الدخول المطابقة وإزالة أي فروقات غير مطلوبة فيها.
- [x] تشغيل الاختبارات وحفظ نسخة checkpoint من الواجهة المطابقة.
- [x] إصلاح فشل deployment الناتج عن غياب /usr/src/app/dist/index.js، وضمان توافق build وstart مع runtime.

- [x] إنشاء نسخة كفر LinkedIn بالمقاس الدقيق 1584×396 بكسل والتحقق من صلاحيتها للرفع.
- [x] تحديث كفر LinkedIn ليستخدم اللوجو الحقيقي المرفق لـ SOPRANOVA بوضوح داخل مقاس 1584×396.
- [x] فحص تصميم Figma الجديد وملف Followpromptinstructions.zip ثم إعادة تطبيق التصميم على صفحات SOPRANOVA مع الحفاظ على الوظائف الحالية.
- [x] إعادة تنفيذ الواجهة كنسخة مطابقة حرفيًا لمصدر Figma المرفق، بما يشمل الصفحات العامة والمصادقة والتطبيق المحمي، مع إبقاء الوظائف الحقيقية الحالية.
- [x] ترحيل وفحص صفحات Agents وAnalytics وData وAutomations وSettings وWorkspace صفحة بصفحة مقابل مصدر Figma وتوثيق الملفات المعدلة.
- [x] تسجيل الدخول بحساب التطوير في متصفح sandbox والتقاط دليل مرئي للمسارات المحمية بعد تطبيق تصميم Figma.

- [x] إضافة اختبارات تكامل idempotency ومعالجة الأخطاء لمعالجات worker الخاصة بالمستندات ومصادر البيانات وworkflows.
- [x] إنهاء دليل النشر المستقل وتقرير التنفيذ النهائي مع توضيح المتطلبات البيئية والتشغيلية.
- [x] إزالة مسار /__dev/seed-login المؤقت وأي اعتماد عليه في التحقق النهائي.
- [x] تحديث حالة التدقيق المرئي المحمي بعد اكتمال مراجعة Analytics وAutomations وDecisions وMemory وActivity وWorkspace وSettings.

- [x] تحليل motion والفيديوهات في مصدر Figma وتحديد مواضع hero/product moments المطلوبة.
- [x] إضافة motion system مطابق لإيقاع Figma مع دعم prefers-reduced-motion.
- [x] إنشاء/إضافة فيديو hero بصيغة web-friendly وتخزينه خارج مجلد المشروع؛ لم يضف المصدر الأصلي فيديوهات product moments.
- [x] دمج فيديو hero والانتقالات في الصفحات العامة دون تغيير النصوص أو الهوية البصرية.
- [x] التحقق بصريًا من الحركة والتنسيق على desktop وmobile ثم تشغيل الاختبارات وحفظ checkpoint.

- [x] تنفيذ فيديو hero أصلي من تصميم SOPRANOVA ودمجه فعليًا في الصفحة العامة بدل الاكتفاء بـ canvas motion.
- [x] مطابقة توقيت الفيديو وطبقات الحركة مع أسلوب Figma والتحقق من fallback عند تعذر تشغيل الفيديو.

- [x] اختبار endpoint الفيديو المرفوع وfallback عند فشل تحميله، مع التأكد من بقاء canvas motion كبديل عبر onError وطبقة canvas المستقلة.
- [x] التحقق من تطبيق PageTransition على جميع public routes وتوثيقها؛ App.tsx يلف index وplatform وintelligence وagents وsolutions وenterprise وabout وcontact وauth routes.
- [x] إعادة تشغيل pnpm check وpnpm test وpnpm build بعد proxy/video ثم حفظ checkpoint جديد.

- [x] إضافة أزرار تحكم سينمائية اختيارية لفيديو Hero: تشغيل/إيقاف، كتم/صوت، وشريط تقدم متاح بلوحة المفاتيح.
- [x] إنشاء فيلم Platform أصلي بنفس هوية SOPRANOVA؛ تعذر إنشاء فيلم Intelligence في هذه الجولة بسبب حد الفيديو اليومي وتم توثيق ذلك.
- [x] دمج فيلم Platform مع fallback وlazy loading والتحكم الاختياري دون تغيير بنية النصوص الأساسية؛ Intelligence يستمر على fallback الصادق حتى يتوفر الأصل.
- [x] اختبار رابط الفيديو والبناء وsmoke visual desktop لفيلم Platform عبر check/test/build وgit diff --check؛ بقيت اختبارات mobile/keyboard/reduced-motion والأداء التفصيلي كبنود منفصلة.
- [x] تنفيذ مراجعة mobile محددة لفيلم Platform بعد ربط الأصل الحقيقي؛ smoke screenshot نجح على 390×844.
- [x] توثيق عقد keyboard focus وreduced-motion وfallback/error state في ExplainerVideo: أزرار semantic مع focus-visible وARIA، range قابل للوحة المفاتيح، matchMedia لتقليل الحركة، وonError للعودة إلى fallback؛ لم تُجرَ جلسة تفاعل آلية مستقلة.

- [x] محاولة توليد فيلم Intelligence تمت وتوقفت عند حد الفيديو المجاني؛ تم توثيق إعادة المحاولة عند تجدد الحصة. فيلم Platform تم توليده ودمجه بالفعل، وIntelligence يستخدم fallback صادقًا إلى حين توفر الأصل.

- [x] تدقيق ومطابقة عائلات الخطوط والأوزان والمسافات والـ line-height في جميع الصفحات العامة والمحمية مع Figma.
- [x] إكمال عناصر التحكم السينمائية المرئية لفيديو Hero مع بقاء الفيديوهات التوضيحية المؤجلة إلى مرحلة لاحقة.
- [x] مراجعة motion والـ responsive states في كل الصفحات العامة والمحمية، ثم اختبار وحفظ checkpoint.

- [x] مزامنة آخر نسخة كاملة من SOPRANOVA إلى repository GitHub المرتبط والتحقق من branch والملفات المرفوعة.
- [x] إعداد prompt عملي لـ OpenCode يشرح architecture والأوامر وقواعد التطوير وحالة الفيديوهات المؤجلة.

- [x] مراجعة واعتماد schema/migrations الجديدة لـ channels وprocedures وprocedure_steps وaction_definitions وaction_calls وtickets؛ المرفق يذكر أنها مطبقة لكن النسخة الحالية لا تحتويها.
- [x] دمج routers الجديدة بعد مراجعة عقودها: channels وprocedures وactions وtickets، مع اختبارات authorization وaudit؛ أضيفت حماية cross-workspace/cross-agent.
- [x] إضافة processActionCall وربطه بالـ worker والـ queue مع idempotency وtimeouts وretry وticket escalation؛ نُفذت HTTP actions وticket escalation مع atomic claim.
- [x] بناء UI حقيقية للقنوات والـ procedures والـ actions والـ helpdesk دون mock data أو ادعاء تكاملات خارجية.
- [x] تحديث docs/refactor-plan.md أو توحيده مع الخطة المرفقة وتوثيق backlog الخاص بـ Stripe/Shopify/search_knowledge/cost metrics.
- [x] تشغيل migrations والاختبارات والبناء بعد اعتماد Chatbase-parity، ثم إنشاء فرع feature وPull Request بدل الدفع المباشر إلى main.

- [x] تنفيذ Chatbase-parity: إضافة جداول channels وprocedures وprocedure_steps وaction_definitions وaction_calls وtickets مع migration SQL حقيقية.
- [x] دمج routers channels/procedures/actions/tickets مع workspace authorization وaudit logging واختبارات العزل الأساسية.
- [x] إضافة processActionCall إلى worker مع queue dispatch وidempotency وtimeouts وretry وticket escalation الآمن.
- [x] بناء UI حقيقية لـ Channels وProcedures وActions وHelpdesk باستخدام design system الحالي وبدون mock data.
- [x] تحديث التوثيق وتشغيل check/test/build والتحقق المرئي العام، ثم إنشاء branch feat/chatbase-parity وPull Request للمراجعة؛ تدقيق Operations المصادق عليه محفوظ كبند مستقل أدناه.

- [x] إضافة اختبارات createCaller لـ channels/procedures/actions/tickets تغطي عزل workspace ورفض cross-agent/cross-channel وتأثيرات audit.
- [x] إصلاح validation/error feedback في Operations، خصوصًا إظهار خطأ JSON غير صالح عند إنشاء channel وحالات النماذج الأخرى.
- [ ] تنفيذ تحقق مرئي مصادق عليه لمسار /app/operations على desktop/mobile وتوثيق النتيجة قبل checkpoint.

- [x] إضافة رسائل validation مرئية داخل dialogs الخاصة بـ Procedures وActions وTickets بدل return الصامت عند نقص أو عدم صحة المدخلات.

- [x] تحليل Chatbase الحالي كمصدر مرجعي للـ landing page وapp UX: hierarchy، navigation، CTA، media، وحالات الواجهة؛ موثق في docs/chatbase-ux-analysis.md.
- [x] تحويل نتائج التحليل إلى نظام SOPRANOVA فاتح وأصلي، بلا نسخ علامات أو نصوص أو أصول Chatbase.
- [x] إعداد prompt OpenCode كامل لتطبيق UI/UX مستوحى من Chatbase، مع فيديوهات واجهة قابلة للوصول وأداء جيد؛ موثق في docs/opencode-light-chatbase-ux-prompt.md.
- [x] تنفيذ الدفعة الأولى من Kimi-inspired visual patterns داخل Home وDashboard وPlatform وIntelligencePublic، بما يشمل storytelling بصري وتفاعلات أصلية دون نسخ أصول Kimi.
- [x] إعادة صقل Home وPlatform وIntelligencePublic لتقديم product moments تفاعلية بهوية SOPRANOVA الفاتحة.
- [x] إعادة صقل AgentsPublic وSolutionsPage وEnterprisePage وAboutPage وContactPage ضمن نفس نظام storytelling الفاتح، مع إزالة placeholders التي توحي ببيانات عميل حقيقية.
- [x] إعادة صقل Command Center وOperations بمكونات dashboard قابلة لإعادة الاستخدام وحالات حقيقية من tRPC؛ بقي التحقق المرئي المصادق عليه كبند مستقل.
- [x] تشغيل check/test/build وgit diff --check بعد تغييرات الواجهة؛ لا توجد اختبارات UI مستقلة لأن السلوك الجديد يعتمد على مكونات عرض وtRPC القائم.
- [x] تنفيذ مراجعة بصرية desktop/mobile للصفحات العامة وLogin، مع توثيق أن مراجعة Operations المصادق عليها تحتاج جلسة حقيقية.
- [x] حفظ checkpoint نهائي بعد اكتمال التحديثات المؤكدة؛ النسخة 57477006 منشورة، ويظل تدقيق Operations المصادق عليه منفصلًا ومعلّقًا حتى تتوفر جولة mobile مصادق عليها.
