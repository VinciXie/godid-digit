import configs from "./configs.json";
const list = Object.values(configs);

// console.log("list.length", list.length);

export default function detectPatterns(name: `${string}.bit`): Set<string> {
  const prefix = name.slice(0, -4);
  const results = new Set<string>();
  for (const config of list) {
    // 排除掉 Rare4D
    if (config.name.en != "Rare4D" && config.names.includes(prefix)) {
      results.add(config.name.en);
    }
  }
  return results;
}
