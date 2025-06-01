import React, { useState, useEffect } from "react";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Zap,
  // Moon,
  // Sun,
} from "lucide-react";
import winkSentiment from "wink-sentiment";
import { motion } from "framer-motion";

type SentimentType = "positive" | "negative" | "neutral" | null;

const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [sentiment, setSentiment] = useState<SentimentType>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Sentiment analysis function
  const analyzeSentiment = (inputText: string) => {
    if (!inputText.trim()) {
      setSentiment(null);
      setConfidence(0);
      return;
    }

    try {
      const result = winkSentiment(inputText);
      setIsAnalyzing(false);

      const { normalizedScore } = result;
      const sentimentType: SentimentType =
        normalizedScore > 0.1
          ? "positive"
          : normalizedScore < -0.1
          ? "negative"
          : "neutral";
      const confidenceValue = Math.min(Math.abs(normalizedScore) * 2 + 0.3, 1);

      setSentiment(sentimentType);
      setConfidence(confidenceValue);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      setSentiment("neutral");
      setConfidence(0.5);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => analyzeSentiment(text), 300);
    return () => clearTimeout(timer);
  }, [text]);

  const getSentimentColor = () => {
    if (!sentiment) return "from-gray-400 to-gray-600";
    switch (sentiment) {
      case "positive":
        return "from-green-400 to-emerald-600";
      case "negative":
        return "from-red-400 to-rose-600";
      default:
        return "from-yellow-400 to-orange-500";
    }
  };

  const getSentimentEmoji = () => {
    if (confidence > 0.8) {
      return sentiment === "positive"
        ? "🎉"
        : sentiment === "negative"
        ? "😢"
        : "🤔";
    } else if (confidence > 0.6) {
      return sentiment === "positive"
        ? "😊"
        : sentiment === "negative"
        ? "😕"
        : "😐";
    }
    return "🤷‍♂️";
  };

  const getConfidenceBar = () => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${getSentimentColor()}`}
        animate={{ width: `${confidence * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
  useEffect(() => {
    setIsDark(true);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h1
              className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${getSentimentColor()} bg-clip-text text-transparent`}
            >
              SentiFeel
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover the emotion in your words
            </p>
          </div>
          {/* Add a rounded emoji gif at the top right of the page */}
          <div className="absolute top-0 right-0">
            <img
              src="emoji.gif"
              alt="Emoji Gif"
              className="w-20 h-20 rounded-full shadow-lg border-4 border-white/40"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Enter your text to analyze
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something to see how it feels..."
                className="w-full h-40 p-4 bg-white/50 dark:bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{text.length} characters</span>
                <span>
                  {
                    text
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }{" "}
                  words
                </span>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setText(
                    "I'm absolutely thrilled with this incredible breakthrough! This is genuinely amazing and I couldn't be happier!"
                  )
                }
                className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Try Positive
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setText(
                    "This is absolutely terrible and completely disappointing. I'm extremely frustrated and utterly disgusted with this horrible mess."
                  )
                }
                className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Try Negative
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setText(
                    "The presentation covered various topics. Some points were discussed and several options were mentioned."
                  )
                }
                className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-yellow-300 text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Try Neutral
              </motion.button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Result Card */}
            <motion.div
              key={sentiment || "default"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
            >
              <div
                className={`inline-flex p-6 rounded-full bg-gradient-to-r ${getSentimentColor()} mb-4`}
              >
                <motion.div
                  key={sentiment}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white"
                >
                  {sentiment === "positive" ? (
                    <Smile className="w-12 h-12" />
                  ) : sentiment === "negative" ? (
                    <Frown className="w-12 h-12" />
                  ) : (
                    <Meh className="w-12 h-12" />
                  )}
                </motion.div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                    {sentiment || "Enter text to analyze"}
                  </h3>
                  <div className="text-4xl mt-2">{getSentimentEmoji()}</div>
                </div>

                {sentiment && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span>Confidence</span>
                        <span>{Math.round(confidence * 100)}%</span>
                      </div>
                      {getConfidenceBar()}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {confidence > 0.8
                        ? "Very confident"
                        : confidence > 0.6
                        ? "Moderately confident"
                        : "Low confidence"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats Card */}
            {sentiment && (
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Analysis Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {sentiment === "positive"
                        ? "✨"
                        : sentiment === "negative"
                        ? "⚡"
                        : "🔮"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 mt-1">
                      Emotion
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                      {sentiment}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.round(confidence * 100)}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 mt-1">
                      Accuracy
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      Score
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Built with ❤️ By <strong>Jean-Eudes ASSOGBA</strong> on Earth <br />{" "}
            Advanced AI-powered sentiment analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
