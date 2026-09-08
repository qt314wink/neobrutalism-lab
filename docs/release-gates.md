# Foundation release gates

This runbook keeps architectural foundation work ahead of new specimens and avoids
starting a second workstream while the shared system is still in draft.

## 1. Reconcile the branch

1. Update the pull-request branch from `main` and resolve conflicts on that branch.
2. Install exactly the dependency graph recorded in `package-lock.json`:

   ```bash
   npm ci
   ```

3. Run the repository gate:

   ```bash
   npm run validate
   ```

4. Push the reconciled branch and wait for checks against the new head commit. A
   successful check or preview from an older commit is evidence, but it is not a
   gate for the current head.

Draft status and branch conflicts are separate signals. Remove draft status only
after conflicts are resolved, required checks are successful, and the current
preview has been reviewed.

## 2. Review deployed evidence

Review the current-head preview rather than an earlier deployment. At minimum:

- load the Storybook or application entry point without console errors;
- exercise component interactions and keyboard focus;
- inspect representative desktop and mobile widths;
- confirm that reduced-motion behavior remains usable; and
- verify direct links and refreshes do not return a deployment 404.

Record the reviewed commit and preview URL in the pull request so approval is tied
to immutable evidence.

## 3. Merge and verify production

Merge only after the current head satisfies the branch, validation, and preview
gates. Then verify the production deployment generated from the merge commit:

- the deployment reports ready;
- the production URL serves the expected build;
- a representative interaction and direct link work; and
- CI on `main` is successful.

If production verification fails, stop the build order and repair or revert the
foundation before beginning another specimen or capability.

## 4. Open the next workstream

New specimen work may begin after production verification is recorded. Its first
slice should preserve the repository traceability contract:

`observation -> named mechanism -> semantic token -> primitive/helper -> component -> specimen -> test -> deployed evidence`
