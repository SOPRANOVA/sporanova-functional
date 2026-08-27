import { useWorkspace } from "@/contexts/WorkspaceContext";
import { trpc } from "@/lib/trpc";
import { Bot, FileSearch, GitBranch, MessageSquarePlus, PanelRight, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const exampleQuestions = [
  "Why did revenue in Region North decline last quarter?",
  "Which customers are at highest churn risk this month?",
  "What's driving the Q4 forecast variance?",
  "Where are the top pricing opportunities?",
];

export default function Intelligence() {
  const { workspaceId } = useWorkspace();
  const conversations = trpc.conversations.list.useQuery(
    { workspaceId: workspaceId ?? 0 },
    { enabled: Boolean(workspaceId) },
  );
  const [conversationId, setConversationId] = useState<number | null>(null);
  const activeId = conversationId ?? conversations.data?.[0]?.id ?? null;
  const messageList = trpc.conversations.messages.useQuery(
    { workspaceId: workspaceId ?? 0, conversationId: activeId ?? 0 },
    { enabled: Boolean(workspaceId && activeId) },
  );
  const createConversation = trpc.conversations.create.useMutation({
    onSuccess: (conversation) => {
      void conversations.refetch();
      setConversationId(conversation.id);
    },
  });
  const ask = trpc.intelligence.ask.useMutation({
    onSuccess: () => {
      void messageList.refetch();
      void conversations.refetch();
    },
  });
  const [question, setQuestion] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<"trace" | "sources">("trace");
  const bottom = useRef<HTMLDivElement>(null);
  const latestAssistant = [...(messageList.data ?? [])].reverse().find((message) => message.role === "assistant");
  const firstUserQuestion = messageList.data?.find((message) => message.role === "user");

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [ask.isPending, messageList.data]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId || !activeId || !question.trim() || ask.isPending) return;
    const current = question;
    setQuestion("");
    await ask.mutateAsync({ workspaceId, conversationId: activeId, question: current });
  };

  const startConversation = () => {
    if (workspaceId) createConversation.mutate({ workspaceId, title: "New conversation" });
  };

  return (
    <div className="flex h-[calc(100vh-104px)] gap-4 animate-in fade-in duration-300">
      <aside className="hidden w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8E6E2] bg-[#FAFAF8] md:flex">
        <div className="border-b border-[#E8E6E2] p-4">
          <p className="sn-label mb-3">Conversations</p>
          <button type="button" onClick={startConversation} className="flex w-full items-center gap-2 rounded-xl bg-[#1A1F3C] px-3 py-2 text-xs font-medium text-[#F8F6F2] hover:bg-[#252B4A]">
            <MessageSquarePlus size={14} />
            New conversation
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {conversations.isLoading ? (
            <p className="p-3 text-xs text-[#8C887F]">Loading conversations…</p>
          ) : conversations.data?.length ? (
            conversations.data.map((conversation) => (
              <button key={conversation.id} type="button" onClick={() => setConversationId(conversation.id)} className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${activeId === conversation.id ? "bg-[#F0EFF8] font-medium text-[#5B6FA8]" : "text-[#8C887F] hover:bg-[#F4F3F0]"}`}>
                {conversation.title}
              </button>
            ))
          ) : (
            <p className="p-3 text-xs text-[#8C887F]">No conversations yet.</p>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E8E6E2] bg-[#FAFAF8]">
        <div className="flex items-center justify-between border-b border-[#E8E6E2] px-5 py-4">
          <div>
            <p className="text-sm font-medium">{conversations.data?.find((item) => item.id === activeId)?.title ?? "Intelligence"}</p>
            <p className="mt-1 sn-label">Secure workspace context only</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setInspectorOpen((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[#8C887F] transition hover:bg-[#F4F3F0] hover:text-[#1A1F3C]" aria-label={inspectorOpen ? "Hide trace panel" : "Show trace panel"}>
              <PanelRight size={15} />
            </button>
            <Sparkles size={17} className="text-[#6B7FBF]" />
          </div>
        </div>

        {!activeId ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#F4F3F0]"><Bot size={20} className="text-[#6B7FBF]" /></div>
              <p className="font-medium" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem" }}>What would you like to understand?</p>
              <p className="mt-1 max-w-sm text-sm text-[#8C887F]">Ask anything about your business. SOPRANOVA uses the secure workspace context.</p>
              <div className="mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
                {exampleQuestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => { startConversation(); setQuestion(suggestion); }} className="rounded-xl border border-[#E8E6E2] px-3 py-2 text-xs text-[#6B6660] transition hover:border-[#6B7FBF] hover:text-[#1A1F3C]">
                    {suggestion}
                  </button>
                ))}
              </div>
              <button type="button" onClick={startConversation} className="mt-4 rounded-xl bg-[#1A1F3C] px-4 py-2 text-sm text-[#F8F6F2]">New conversation</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-auto p-5 md:p-6">
              {messageList.isLoading ? <p className="text-sm text-[#8C887F]">Loading message history…</p> : messageList.data?.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <article className={`max-w-2xl rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-[#1A1F3C] text-[#F8F6F2]" : "border border-[#E8E6E2] bg-[#F4F3F0] text-[#1A1F3C]"}`}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] opacity-60">{message.role === "user" ? "You" : message.kind}</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    {message.sources.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{message.sources.map((source) => <span key={source.id} className="inline-flex items-center gap-1 rounded-full bg-[#1A1F3C]/5 px-2 py-0.5 text-[10px] text-[#6B6660]"><FileSearch size={10} />{source.label}</span>)}</div>}
                  </article>
                </div>
              ))}
              {ask.isPending && <div className="flex"><div className="rounded-2xl border border-[#E8E6E2] bg-[#F4F3F0] px-4 py-3"><p className="sn-label mb-2">Intelligence is processing</p><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8C887F]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8C887F] [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8C887F] [animation-delay:300ms]" /></span></div></div>}
              {ask.error && <p className="rounded-xl bg-[#FDF0EE] p-3 text-sm text-[#B8675A]">{ask.error.message}</p>}
              <div ref={bottom} />
            </div>
            <form onSubmit={submit} className="border-t border-[#E8E6E2] p-4 md:p-5">
              <div className="flex gap-2 rounded-xl bg-[#F4F3F0] p-2 ring-1 ring-transparent transition focus-within:ring-[#6B7FBF]">
                <input value={question} onChange={(event) => setQuestion(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#B8B4AC]" placeholder="Ask SOPRANOVA about this workspace…" disabled={ask.isPending} />
                <button type="submit" disabled={!question.trim() || ask.isPending} className="grid h-9 w-9 place-items-center rounded-lg bg-[#1A1F3C] text-[#F8F6F2] disabled:bg-[#D4D1CB]"><Send size={15} /></button>
              </div>
            </form>
          </>
        )}
      </section>

      {inspectorOpen && <aside className="hidden w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E8E6E2] bg-[#FAFAF8] lg:flex">
        <div className="border-b border-[#E8E6E2] p-4"><div className="flex items-center gap-2"><GitBranch size={15} className="text-[#6B7FBF]" /><p className="sn-label">Agent Backstage</p></div><p className="mt-2 text-xs leading-relaxed text-[#8C887F]">Inspect the evidence path for the selected conversation.</p></div>
        <div className="flex border-b border-[#E8E6E2] p-2"><button type="button" onClick={() => setInspectorTab("trace")} className={`flex-1 rounded-lg px-2 py-2 text-xs ${inspectorTab === "trace" ? "bg-[#F0EFF8] font-medium text-[#1A1F3C]" : "text-[#8C887F]"}`}>Trace</button><button type="button" onClick={() => setInspectorTab("sources")} className={`flex-1 rounded-lg px-2 py-2 text-xs ${inspectorTab === "sources" ? "bg-[#F0EFF8] font-medium text-[#1A1F3C]" : "text-[#8C887F]"}`}>Sources</button></div>
        <div className="flex-1 overflow-auto p-4">
          {inspectorTab === "trace" ? <div className="space-y-3">{["User question", "Retrieved knowledge", "Agent response"].map((step, index) => <div key={step} className="relative pl-6"><span className="absolute left-0 top-1.5 grid h-3 w-3 place-items-center rounded-full bg-[#F0EFF8] text-[8px] text-[#6B7FBF]">{index + 1}</span>{index < 2 && <span className="absolute left-[5px] top-5 h-8 border-l border-dashed border-[#D4D1CB]" />}<p className="text-xs font-medium text-[#1A1F3C]">{step}</p><p className="mt-1 text-[11px] leading-relaxed text-[#8C887F]">{index === 0 ? (firstUserQuestion?.content || "Waiting for a question") : index === 1 ? (latestAssistant?.sources.length ? `${latestAssistant.sources.length} source${latestAssistant.sources.length === 1 ? "" : "s"} attached` : "No source attached to the latest response") : (latestAssistant?.content || "No assistant response yet")}</p></div>)}</div> : <div>{latestAssistant?.sources.length ? <div className="space-y-2">{latestAssistant.sources.map((source) => <div key={source.id} className="flex items-start gap-2 rounded-xl bg-[#F4F3F0] p-3"><FileSearch size={13} className="mt-0.5 shrink-0 text-[#6B7FBF]" /><span className="text-xs leading-relaxed text-[#6B6660]">{source.label}</span></div>)}</div> : <div className="rounded-xl border border-dashed border-[#D4D1CB] p-4 text-xs leading-relaxed text-[#8C887F]">Sources will appear here when the connected intelligence response includes evidence.</div>}</div>}
        </div>
      </aside>}
    </div>
  );
}
