import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { humanizerTypes, HumanizerType } from "./humanizer-types";

interface TypeSelectorProps {
  selected: HumanizerType | null;
  onSelect: (type: HumanizerType) => void;
}

export function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  const handleTypeChange = (value: string) => {
    onSelect(value as HumanizerType);
  };
  return (
    <RadioGroup
      value={selected}
      onValueChange={handleTypeChange}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {humanizerTypes.map((type, index) => (
        <motion.div
          key={type.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 1.2,
          }}
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <AnimatePresence>
            {type.value === selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-px rounded-lg bg-primary/10 ring-2 ring-primary/30 dark:ring-primary/50"
              />
            )}
          </AnimatePresence>
          <RadioGroupItem
            value={type.value}
            id={type.value}
            className="peer absolute inset-0 opacity-0"
          />
          <Label
            htmlFor={type.value}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border backdrop-blur cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-accent/50 dark:hover:bg-accent/10 ${type.value === selected ? "bg-primary/20 border-primary shadow-xl scale-105 dark:shadow-primary/30 ring-2 ring-primary/50" : "bg-background/50 hover:bg-background/80 hover:scale-102 border-border"}`}
          >
            <span className="font-medium">{type.label}</span>
            <span className="text-xs text-muted-foreground text-center mt-1">
              {type.description}
            </span>
          </Label>
        </motion.div>
      ))}
    </RadioGroup>
  );
}
