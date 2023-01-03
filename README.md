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

-   Groups and Folders progressbar to show different levels of mems, LT/ST and not even started
-   learn context should be able to focus on folders/subfolders
-   Sort out the hint/notes bits and give them a purpose
-   Separate learn/revise so we can either check what's to check or increase our vocab, learn should have a couple of times showing the item with the answer, then maybe a 3 item quizz with hints and such
-   Setting to limit number of mems in learn/review sesh.
-   Settings progress bar for storage space (limit is 50Mb) and a button to strip history (anything before the last fail)
-   Export option to strip progress, Import to match IDS and offer a merge/override
-   Find a way to use a github folder as a source for import, allow to delete mems by folders/subfolders
-   Stats and graphs everywhere
    -   At the end of a sesh (how many mems moved up to long term memory, how many new mems, time of the sesh, how many in the sesh, state of mems, etc..)
    -   in the mems folders/subfolders
    -   homepage with an overall view of everything
