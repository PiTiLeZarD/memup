# memup

Check out the [demo](https://pitilezard.github.io/memup/)

I used to enjoy memrise, and it's changed quite a bit since I've used it. So I'm doing my own. I'm learning japanese so you'll have a lot of japanese specific stuff in here.

## Install & run

```
pnpm install
pnpm dev
```

## TODO

Planned and in order

-   Fix the bug where useMemo is breaking the rule of hooks because the list is changing size (either by adding a mem, or at the end of a sesh where the list is emptied)
-   Separate learn/revise so we can either check what's to check or increase our vocab, learn should have a couple of times showing the item with the answer, then maybe a 3 item quizz with hints and such
-   Group mems in folders/subfolders, learn/revise should be able to focus on folders/subfolders
-   Export option to strip progress, Import to match IDS and offer a merge/override
-   Find a way to use a github folder as a source for import, allow to delete mems by folders/subfolders
-   Stats and graphs everywhere
    -   At the end of a sesh (how many mems moved up to long term memory, how many new mems, time of the sesh, how many in the sesh, state of mems, etc..)
    -   in the mems folders/subfolders
    -   homepage with an overall view of everything
