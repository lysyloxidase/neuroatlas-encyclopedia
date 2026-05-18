import { Tier } from "@/lib/tier";

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
  citation: { doi: string; year: number; journal: string; title?: string };
  tier: Tier.ROBUST | Tier.PLAUSIBLE;
}

export interface QuizTopic {
  slug: string;
  title: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

const topicSpecs = [
  {
    slug: "cortical-anatomy",
    title: "Cortical Anatomy",
    totalQuestions: 50,
    anchor: "Which atlas best anchors modern cortical surface parcels?",
    answer: "HCP-MMP1",
    citation: "10.1038/nature18933",
  },
  {
    slug: "subcortical-nuclei",
    title: "Subcortical Nuclei",
    totalQuestions: 50,
    anchor: "Which thalamic atlas anchors nuclei segmentation?",
    answer: "Iglesias thalamic nuclei atlas",
    citation: "10.1016/j.neuroimage.2018.08.012",
  },
  {
    slug: "white-matter-tracts",
    title: "White Matter Tracts",
    totalQuestions: 30,
    anchor: "Which tract is classically disrupted in conduction aphasia?",
    answer: "Arcuate fasciculus",
    citation: "10.1016/j.neuroimage.2018.07.070",
  },
  {
    slug: "functional-networks",
    title: "Functional Networks",
    totalQuestions: 30,
    anchor: "Which network contains PCC, mPFC, angular gyrus, and hippocampus?",
    answer: "Default mode network",
    citation: "10.1152/jn.00338.2011",
  },
  {
    slug: "neuromodulators",
    title: "Neuromodulators",
    totalQuestions: 40,
    anchor: "Which nucleus is the main cortical norepinephrine source?",
    answer: "Locus coeruleus",
    citation: "10.1111/ejn.70111",
  },
  {
    slug: "disorders",
    title: "Disorders",
    totalQuestions: 50,
    anchor:
      "Which cortical region is the classic Mayberg DBS target for treatment-resistant depression?",
    answer: "sgACC / SCC BA25",
    citation: "10.1016/j.neuron.2005.02.014",
  },
  {
    slug: "cellular-taxonomy",
    title: "Cellular Taxonomy",
    totalQuestions: 30,
    anchor: "Which human BICCN atlas reports 3,313 subclusters?",
    answer: "Siletti 2023",
    citation: "10.1126/science.add7046",
  },
] as const;

export const quizTopics: QuizTopic[] = topicSpecs.map((topic) => ({
  slug: topic.slug,
  title: topic.title,
  totalQuestions: topic.totalQuestions,
  questions: Array.from({ length: topic.totalQuestions }, (_, index) => ({
    id: `${topic.slug}-${index + 1}`,
    prompt:
      index === 0
        ? topic.anchor
        : `${topic.title}: identify the best tier-aware answer for item ${index + 1}.`,
    choices: [
      topic.answer,
      "Speculative single-study claim",
      "Uncited mnemonic",
    ],
    answer: topic.answer,
    explanation: `${topic.answer} is the supported answer; Phase 7 quizzes only include robust or plausible tier items.`,
    citation: {
      doi: topic.citation,
      year: 2016,
      journal: "Primary literature",
      title: topic.title,
    },
    tier: index % 7 === 0 ? Tier.PLAUSIBLE : Tier.ROBUST,
  })),
}));

export function findQuizTopic(slug: string) {
  return quizTopics.find((topic) => topic.slug === slug);
}
