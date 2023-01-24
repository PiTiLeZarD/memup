# memup

Memup is a language learning tool, primarily focused on japanese for the moment as this is what I'm learning.

Check out the [demo](https://pitilezard.github.io/memup/)

I know a lot of these tools exist here and there, but:

1.  I couldn't find one with all the features I wanted
2.  I kinda like coding this one so ¯\\\_(ツ)\_/¯

## Install & run

Probably works with yarn npm and all these but I use pnpm:

```
pnpm install
pnpm dev
```

## TODO

Planned and in order

-   Import to match IDS and offer a merge/override
    -   add a zustand variables for import conflicts
    -   import would have a function to get 2 mems and see if they conflicts, returns the nature of the conflict
    -   on import separate mems that can be imported as is and mems that conflict
    -   interface to review conflicts, on the left the memform, on the right what we're trying to import, basic copy paste, if the logs conflict a button to accept incoming logs and override current logs
-   Kanji reading game
    -   take all long term memory mems with kanji
    -   present them without the furigana, kanji only
    -   hiragana input
    -   record fail/success somewhere else, use the same logic to push mems through levels and all
-   Find a way to use a github folder as a source for import, allow to delete mems by folders/subfolders
-   related mems, have a way to point which are related, save the ids, and on import, match ids and fill up accodingly
-   Merge mems and have multiple folders for a mem.
-   Stats and graphs everywhere
    -   At the end of a sesh (how many mems moved up to long term memory, how many new mems, time of the sesh, how many in the sesh, state of mems, etc..)
    -   homepage with an overall view of everything
