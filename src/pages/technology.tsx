import { motion } from "framer-motion";
import { Cpu, Brain, Network, Sparkles } from "lucide-react";

export default function Technology() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">Our Technology</h1>
          <p className="text-xl text-muted-foreground">
            Powered by cutting-edge AI and natural language processing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <Brain className="w-8 h-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Neural Networks</h3>
                <p className="text-muted-foreground">
                  Advanced neural networks trained on diverse text datasets
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Network className="w-8 h-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Natural Language Processing
                </h3>
                <p className="text-muted-foreground">
                  State-of-the-art NLP algorithms for text understanding
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <Cpu className="w-8 h-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Cloud Infrastructure
                </h3>
                <p className="text-muted-foreground">
                  Scalable cloud processing for fast results
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Style Transfer</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms for maintaining context while transforming
                  style
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
