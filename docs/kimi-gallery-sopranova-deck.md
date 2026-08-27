# عرض: استخدام معرض Kimi لتطوير واجهات SOPRANOVA

## Cover
استخدام معرض Kimi لتطوير واجهات SOPRANOVA
من الإلهام البصري إلى نظام منتج قابل للتنفيذ
SOPRANOVA — UI/UX Development Guide

## Slide 1
### لماذا نستخدم معرض Kimi؟
المعرض ليس قالبًا ننسخه؛ إنه مكتبة لتفكيك أنماط الواجهات التفاعلية.

- ندرس كيف تُعرض الفكرة بسرعة.
- نلاحظ تسلسل الشاشة، الحركة، والـ interaction.
- نترجم النمط إلى مكوّن أصلي يخدم بيانات SOPRANOVA الحقيقية.
- النتيجة المطلوبة: واجهة فاتحة واضحة، وليست نسخة من Kimi.

## Slide 2
### ما الذي يقدمه معرض Kimi؟
صفحة Kimi Websites تعرض نماذج قابلة للمعاينة ضمن فئات مثل Landing Page وDashboard وVisualization وTool، إضافة إلى نماذج Full-stack.

| فئة المعرض | ما نبحث عنه في SOPRANOVA |
|---|---|
| Landing Page | ترتيب الرسالة، الـ CTA، والشرح البصري |
| Dashboard | التسلسل الهرمي للمعلومات ومناطق القرار |
| Visualization | تحويل البيانات المعقدة إلى قصة قابلة للفهم |
| Tool / Full-stack | حالات الاستخدام، النماذج، والتغذية الراجعة |

المصدر: معرض Kimi الرسمي.

## Slide 3
### قاعدة العمل: نأخذ السلوك لا الهوية
ثلاثة مستويات يجب فصلها أثناء التحليل:

1. **Structure:** أين يوجد التنقل، العنوان، المحتوى، والإجراء؟
2. **Interaction:** ماذا يحدث عند النقر، التمرير، التصفية، أو فتح التفاصيل؟
3. **Identity:** الألوان، الخطوط، الشعار، النصوص، الصور، والأصول — تبقى SOPRANOVA أصلية.

> نستخدم Kimi كمرجع UX، ونبني SOPRANOVA كنظام مستقل بهوية ivory / navy / periwinkle.

## Slide 4
### خريطة النماذج المناسبة لـ SOPRANOVA
نربط كل نوع من نماذج Kimi بصفحة منتج حقيقية:

| نموذج مرجعي | صفحة SOPRANOVA المستهدفة | القيمة الوظيفية |
|---|---|---|
| Command Center | Command Center | ملخص تشغيلي سريع |
| Customer Insight | Intelligence / Analytics | اكتشاف الأنماط والأسباب |
| Knowledge Atlas | Data / Memory | فهم مصادر المعرفة |
| Admin Console | Workspace / Settings | التحكم والأدوار والأمان |
| Concept Explainer | Platform / Intelligence | شرح المنتج بصريًا |
| Repo Insights | Activity / Decisions | تتبع الأدلة والقرارات |

## Slide 5
### تحويل النموذج إلى رحلة منتج
تجربة SOPRANOVA يجب أن تتحرك في دورة واضحة:

**Connect → Configure → Validate → Operate**

- Connect: مصادر البيانات، المستندات، والذاكرة.
- Configure: Agents، Procedures، Guardrails، وActions.
- Validate: اختبار السيناريوهات، دقة المخرجات، وحالات الخطأ.
- Operate: Channels، Helpdesk، Analytics، Decisions، وActivity.

كل مرحلة يجب أن ترتبط بحالة حقيقية من الـ backend، لا ببطاقة زخرفية فقط.

## Slide 6
### الترجمة البصرية إلى Light Mode
نحتفظ بإحساس المنتج premium دون Dark Mode:

| العنصر | قرار SOPRANOVA |
|---|---|
| الخلفية | Ivory دافئة ومضيئة |
| النص | Navy عالي التباين |
| التفاعل | Periwinkle للأزرار والروابط |
| الحالة الصحية | Teal للاتصال والنجاح |
| البطاقات | أبيض، حدود رقيقة، ظل محدود |
| الفيديو والـ diagram | Navy كمساحة تركيز، لا كخلفية عامة |
| الخط | Instrument Serif للعناوين، Inter لكل UI والبيانات |

## Slide 7
### هندسة الواجهة قبل كتابة الكود
نقسم التنفيذ إلى طبقات قابلة لإعادة الاستخدام:

- **Layout:** App shell، sidebar، header، mobile navigation.
- **Primitives:** Status pills، metric cards، tabs، dialogs، empty/error states.
- **Feature components:** Agent card، procedure editor، action row، ticket panel.
- **Route pages:** تنسيق البيانات والـ composition فقط.
- **Data layer:** tRPC hooks وmutations مع workspace isolation.

الهدف هو أن يكون تغيير التصميم مركزيًا، وأن تُستخدم المكونات نفسها في Operations وAnalytics وWorkspace.

## Slide 8
### الفيديو والحركة كشرح للمنتج
نستخدم الفيديو لتوضيح الفكرة، لا لزيادة الضوضاء البصرية.

- Hero video داخل نافذة navy مع play/pause وmute/progress.
- Platform Film يشرح: data fragmentation → governed operating layer → action.
- Intelligence Film يشرح: context → patterns → cited insight → recommendation.
- Lazy loading و`preload="metadata"` وfallback صادق عند غياب الأصل.
- `prefers-reduced-motion` يوقف autoplay والحركة غير الضرورية.

حتى توفر الأصول الفعلية، يجب أن يظهر fallback واضح بدل الادعاء بأن فيديو حقيقي يعمل.

## Slide 9
### من المعرض إلى تنفيذ حقيقي
منهج التنفيذ المقترح في خمس خطوات:

1. اختر نموذجًا من المعرض وحدد ما تريد قياسه: hierarchy، motion، density، أو conversion.
2. صوّر النمط في brief مستقل، ثم اربطه بصفحة SOPRANOVA المناسبة.
3. صمّم نسخة light-mode باستخدام tokens SOPRANOVA، لا ألوان Kimi.
4. اربط كل تفاعل بـ tRPC/API حقيقي، وأضف loading وempty وerror states.
5. اختبر desktop/mobile، لوحة المفاتيح، reduced motion، والعزل بين workspaces.

يجب أن تبقى الهوية أصلية: لا شعار أو نصوص أو screenshots أو testimonials من Kimi، ولا بيانات أو integrations وهمية، ولا قناة تُعرض كمتصلة دون provider حقيقي.

## Slide 10
### معيار النجاح
واجهة SOPRANOVA الناجحة تحقق أربعة شروط في وقت واحد:

| البعد | معيار التحقق |
|---|---|
| الوضوح | يفهم المستخدم أين يبدأ وماذا يفعل بعد ذلك |
| الأصالة | الهوية البصرية واللغة تخص SOPRANOVA بالكامل |
| الوظيفة | البيانات والتفاعلات مربوطة بالـ backend الحقيقي |
| الجودة | responsive، accessible، سريعة، وقابلة للاختبار |

## Slide 11
### الخطوة التالية
نحوّل النماذج المرجعية إلى backlog تنفيذي محدد:

**Select → Deconstruct → Rebrand → Connect → Verify**

نبدأ بـ Command Center وOperations، ثم نكمل Intelligence وData وAnalytics، مع إدخال Platform Film وIntelligence Film بعد توفر الأصول الفعلية.

المراجع:

[1] Kimi Websites — https://www.kimi.com/en/websites
[2] Kimi AI — https://www.kimi.ai/en
[3] SOPRANOVA Chatbase UX Analysis — `docs/chatbase-ux-analysis.md`

ملاحظة: النماذج المذكورة من معرض Kimi تُستخدم كمرجع تعليمي لتفكيك تجربة المستخدم، وليست أصولًا تُعاد طباعتها أو تُنسب إلى SOPRANOVA.

## References
[1]: https://www.kimi.com/en/websites "Kimi Websites — Official Showcase"
[2]: https://www.kimi.ai/en "Kimi AI — Official Site"
[3]: https://www.chatbase.co/ "Chatbase — Functional UX Reference"
[4]: https://www.chatbase.co/blog/the-ai-agent-playbook "The AI Agent Playbook — Chatbase"

## Design direction
عرض عربي RTL، editorial enterprise، خلفية ivory، نص navy، accent periwinkle، خطوط Instrument Serif وInter، مساحات واسعة، بطاقات فاتحة، ومخططات عملية. لا تستخدم Dark Mode كخلفية عامة. استخدم navy فقط داخل media/product windows أو diagram panels.
