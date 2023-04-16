import configs from "./configs.json";

export default function detectPatterns(name: `${string}.bit`): Set<string> {
  const prefix = name.slice(0, -4);
  const results = new Set<string>();
  for (const config of Object.values(configs)) {
    // 排除掉 Rare4D
    if (config.names.includes(prefix) && config.name.en != "Rare4D") {
      results.add(config.name.en);
    }
  }
  return results;
}
