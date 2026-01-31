"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ParentTopicSearch from "@/components/ParentTopicSearch";
import MarkdownTextarea from "@/components/MarkdownTextarea";
import Link from "next/link";

interface ContentBlock {
  type: "text" | "code";
  value: string;
}

interface Topic {
  id: string;
  title: string;
  category: string;
  parentTopicId: string;
  parentTopicTitle: string;
  keywords: string[];
  content: ContentBlock[];
}

export default function EditTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [parentTopicId, setParentTopicId] = useState("");
  const [parentTopicTitle, setParentTopicTitle] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { type: "text", value: "" },
  ]);

  useEffect(() => {
    // Load categories
    fetch("/data/categories.json")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));

    // Load topic data
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        const topic = data.topics?.find((t: Topic) => t.id === topicId);
        if (topic) {
          setTitle(topic.title);
          setCategory(topic.category);
          setParentTopicId(topic.parentTopicId || "");
          setParentTopicTitle(topic.parentTopicTitle || "");
          setKeywords(topic.keywords || []);
          setContentBlocks(
            topic.content?.length > 0
              ? topic.content
              : [{ type: "text", value: "" }],
          );
        }
        setLoadingTopic(false);
      })
      .catch(() => setLoadingTopic(false));
  }, [topicId]);

  const addContentBlock = (type: "text" | "code") => {
    setContentBlocks([...contentBlocks, { type, value: "" }]);
  };

  const updateContentBlock = (index: number, value: string) => {
    const updated = [...contentBlocks];
    updated[index].value = value;
    setContentBlocks(updated);
  };

  const removeContentBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: topicId,
          title,
          category,
          parentTopicId,
          parentTopicTitle,
          content: contentBlocks,
          keywords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/topics");
      } else {
        alert("Failed to update topic");
      }
    } catch (error) {
      alert("Error updating topic");
    } finally {
      setLoading(false);
    }
  };

  if (loadingTopic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading topic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/topics" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Edit Topic</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Topic Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="E.g., Substring() của String và StringBuilder"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setParentTopicId("");
              setParentTopicTitle("");
            }}
            required
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Parent Topic (Medium-level topic)
          </label>
          <ParentTopicSearch
            value={parentTopicId}
            onChange={(id, title) => {
              setParentTopicId(id);
              setParentTopicTitle(title);
            }}
            category={category}
          />
          {parentTopicTitle && (
            <p className="mt-2 text-sm text-gray-400">
              Selected:{" "}
              <span className="text-blue-400">{parentTopicTitle}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Keywords</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addKeyword())
              }
              placeholder="Add keyword and press Enter"
              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="badge bg-blue-600/20 text-blue-400 flex items-center space-x-2"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
          <div className="h-[75vh] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/50">
            <div className="sticky top-0 bg-gray-800 z-10 p-3 border-b border-gray-700">
              <div className="flex items-center justify-end">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addContentBlock("text")}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    + Text Block
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock("code")}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    + Code Block
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-4 px-8">
              {contentBlocks.map((block, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-400">
                      {block.type === "text" ? "📝 Text" : "💻 Code"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      className="text-red-400 hover:text-red-300"
                      title="Remove Block"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {block.type === "text" ? (
                    <MarkdownTextarea
                      value={block.value}
                      onChange={(val) => updateContentBlock(index, val)}
                      rows={4}
                      placeholder="Paste từ Word/Docs và giữ format..."
                    />
                  ) : (
                    <CodeEditor
                      value={block.value}
                      onChange={(val) => updateContentBlock(index, val || "")}
                      language="java"
                      height="200px"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={20} />
            <span>{loading ? "Updating..." : "Update Topic"}</span>
          </button>
          <Link href="/admin/topics" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
