# Project TODO

- [x] Estrarre e analizzare il frontend esportato, censendo route, pagine, componenti, interazioni e dati simulati.
- [x] Produrre la mappa verificabile schermata → azione → regola → dati → API → permessi → stato UI, incluse le assunzioni.
- [ ] Verificare schermata per schermata l’allineamento finale al frontend allegato con una sessione autenticata e documentare le eventuali differenze UI residue.
- [x] Definire schema dati normalizzato, multi-tenant e migrabile per organizzazioni, workspace, membership, agenti, conversazioni, sorgenti dati, documenti, automazioni, notifiche e audit log.
- [x] Verificare l’isolamento tenant con middleware server-side e test di accesso cross-workspace, dopo la migrazione versionata già applicata.
- [x] Implementare RBAC server-side estendibile per Owner, Admin, Member e Viewer nel flusso di autenticazione esistente.
- [x] Implementare API tRPC modulari con validazione, autorizzazione, risposte ed errori coerenti, logging strutturato e health check.
- [x] Implementare dashboard e analytics server-side con intervalli, filtri, aggregazione, ordinamento e paginazione.
- [x] Implementare agenti, esecuzioni tracciabili, conversazioni persistenti e ricerca della cronologia nel workspace autorizzato.
- [x] Completare un connettore data source HTTP reale, gestione cifrata delle credenziali e pipeline di sincronizzazione asincrona prima di attivare sorgenti esterne.
- [x] Completare data source, documenti e file con metadati, stato, controllo accessi, validazione, cancellazione sicura e connettore HTTP sincronizzato.
- [x] Implementare automazioni, notifiche persistenti e audit log per le azioni sensibili evidenziate dal frontend.
- [ ] Completare la sostituzione dei controlli non operativi delle integrazioni esterne con flussi configurati o nasconderli fino alla configurazione.
- [ ] Eseguire la verifica visiva autenticata delle principali schermate app e rifinire eventuali differenze dall’interfaccia allegata.
- [ ] Estendere i test Vitest ai flussi applicativi agenti, intelligence, workflow, notifiche, analytics e frontend/backend oltre alla copertura già presente di authz, salute e upload.
- [x] Preparare seed di sviluppo, configurazione ambienti, documentazione API, architettura, migrazioni e istruzioni di distribuzione.
- [ ] Eseguire i percorsi utente autenticati principali dopo il login OAuth e registrare l’evidenza di validazione finale.
- [x] Eseguire un audit completo delle dipendenze Manus nel codice, nelle dipendenze, negli script e nella configurazione runtime.
- [x] Sostituire il runtime Manus con un backend SOPRANOVA portabile e configurato esclusivamente tramite variabili d’ambiente proprietarie.
- [x] Sostituire l’autenticazione OAuth Manus con un’architettura indipendente per password, sessioni, OAuth e RBAC.
- [x] Sostituire database, storage, AI e notifiche Manus con adapter indipendenti e provider configurabili.
- [ ] Estendere la coda e il worker autonomi, già operativi per le esecuzioni agente, a elaborazione documenti, sincronizzazioni data source e workflow programmati provider-specifici.
- [x] Predisporre un file di configurazione template completo, senza credenziali, e un percorso di configurazione locale/produttivo portabile.
- [x] Isolare o eliminare framework, endpoint, environment variable e pacchetti Manus dalla build di produzione.
- [x] Preparare sviluppo locale, backup database, migrazioni, seed e istruzioni di deploy indipendenti dal provider.
- [x] Eseguire il test di portabilità e l’audit finale per attestare l’assenza di dipendenze runtime da Manus.

- [x] مطابقة صفحات الموقع العامة وصفحات الدخول حرفيًا مع واجهة الملف المرفق، من دون إعادة تصميم أو تحسينات بصرية إضافية.
- [ ] مقارنة التخطيط والألوان والخطوط والمسافات والمكونات وصفحات التطبيق المحمية الأصلية صفحة بصفحة بعد الدخول بجلسة حقيقية.
- [x] التقاط لقطات تحقق لكل صفحات الموقع العامة وصفحات الدخول المطابقة وإزالة أي فروقات غير مطلوبة فيها.
- [x] تشغيل الاختبارات وحفظ نسخة checkpoint من الواجهة المطابقة.
- [x] إصلاح فشل deployment الناتج عن غياب /usr/src/app/dist/index.js، وضمان توافق build وstart مع runtime.

- [x] إنشاء نسخة كفر LinkedIn بالمقاس الدقيق 1584×396 بكسل والتحقق من صلاحيتها للرفع.
- [x] تحديث كفر LinkedIn ليستخدم اللوجو الحقيقي المرفق لـ SOPRANOVA بوضوح داخل مقاس 1584×396.
