# Design then Test

Before you so much as touch a programming language file I better see a commit with documentation on the contract with which your contribution is supposed to be implementing.

This is for multiple reasons.

1. It keeps you from wasting your time submitting work that would not be merged into The Solution.
2. It keeps from following [Bad Practice](#bad-practice)

# Test then Implement

Okay maybe not _then_ so much as _simultaneously_.

But be sure to include tests that validate the behavior you've defined in your contract.

# Bad Practice

Yes. Yes I did! There exists few other professions where the contract for work is determined as the work is done, or even _after_ it.

No. `swagger` is simply not a good tool nor approach. You define your contract based on your customer's needs/desires. You document that contract. _THEN_ you implement the behavior.

If the behavior does not reflect the contract then it is a _BUG_. CONTRACT DICTATES BEHAVIOR. Not the other way around. Not simultaneously.

If I see you commit implementation before documenting the contract via some README or other means...I will not ban you from contributing. But I will look at you disdainfully and sigh heavily.

# But Nate - you don't have any tests written yet!

I KNOW. I'm working on it. Contracts are still being defined so I still have some excuse.
