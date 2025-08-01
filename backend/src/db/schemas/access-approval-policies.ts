// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const AccessApprovalPoliciesSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  approvals: z.number().default(1),
  secretPath: z.string(),
  envId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  enforcementLevel: z.string().default("hard"),
  deletedAt: z.date().nullable().optional(),
  allowedSelfApprovals: z.boolean().default(true)
});

export type TAccessApprovalPolicies = z.infer<typeof AccessApprovalPoliciesSchema>;
export type TAccessApprovalPoliciesInsert = Omit<z.input<typeof AccessApprovalPoliciesSchema>, TImmutableDBKeys>;
export type TAccessApprovalPoliciesUpdate = Partial<
  Omit<z.input<typeof AccessApprovalPoliciesSchema>, TImmutableDBKeys>
>;
