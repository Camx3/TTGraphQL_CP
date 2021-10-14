import FeatureResolver from "./feature/resolver"
import GenomeResolver from "./genome/resolver"


// Important: Add all your module's resolver in this
export const resolvers: [Function, ...Function[]] = [
  FeatureResolver,
  GenomeResolver,
];
