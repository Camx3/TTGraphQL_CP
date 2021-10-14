import TodoResolver from "./todo/resolver";
import FeatureResolver from "./feature/resolver"
import GenomeResolver from "./genome/resolver"


// Important: Add all your module's resolver in this
export const resolvers: [Function, ...Function[]] = [
  TodoResolver,
  FeatureResolver,
  GenomeResolver,
  // UserResolver
  // AuthResolver
  // ...
];
