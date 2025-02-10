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
      className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
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
            className={`flex flex-col items-center justify-center h-[100px] p-3 rounded-lg border backdrop-blur cursor-pointer transition-all duration-300 ${type.gradient} ${type.color} hover:shadow-xl hover:scale-105 hover:text-white ${type.value === selected ? "bg-gradient-to-r border-transparent shadow-lg scale-105 text-white" : "bg-card hover:border-transparent"}`}
          >
            <span className="text-lg mb-1">{type.icon}</span>
            <span className="text-sm font-medium">{type.label}</span>
            <span className="text-[11px] opacity-75 text-center leading-tight mt-0.5">
              {type.description}
            </span>
          </Label>
        </motion.div>
      ))}
    </RadioGroup>
  );
}
