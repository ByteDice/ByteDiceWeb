<!-- If you've forked the repository then "ByteDice.net" might want to be changed to your product -->
# ByteDice.net/toys/crafting Documentation


## General Information
> In this documentation, I will refer to the page (ByteDice.net/toys/crafting) as "CTree" (Crafting-Tree) for simplicity.

CTree is a tool designed for generating **multiple** "crafting trees", which are tree structures that
represent how items combine to other items, eventually leading to a product. It currently only
supports additive and transformative crafting, I.E., `A + B + ... = C` and `A -> B`.
CTree also uses the TOML format for its input data.


## Making a Tree
As said earlier, CTree uses the TOML format as data. The data is split into 2 important parts, `[io]` and `recipes`.

* `[io]` contain the items that the crating tree is allowed to use as starting items,
         as well as the products it should produce. This should not contain every item,
				 only the "starting" items (more on that later).
* `[recipes]` contains the recipe data, AKA, how items turn into other items

To start off, lets add the 2 parts and some other required data.

```toml
# This hashtag line is a comment and is ignored by the format.
# Comments are only for clarity and are completely optional.

[io]
# Here we add our starting items (without it the program wouldn't do anything)
inputs = []
# Here we add our products (without it the program wouldn't do anything)
products = []


[recipes]
# We'll add more here soon
```

in both `inputs` and `products`, you specify items as a string arrays (the square brackets).
It's important to note that capitalization matters, "Item" and "item" are not the same thing.

Make sure you separate each entry with a comma, and encase each string in quotes.

```toml
[io]
# Here we add our starting items (without it the program wouldn't do anything)
inputs = ["item1", "item2", "item3"]
# Here we add our products (without it the program wouldn't do anything)
products = ["product1", "product2", "product3"]
```

Now we can add recipes, which is a fairly similar and easy process, but instead of adding items
to an array, we are making that array. Only 1 recipe can exist per item since there is no way for
the program to choose between 2 recipes.

The way we declare a recipe is to list the product, followed by an array of its ingredients.
Spaces are not allowed in item names by the way, I suggest using underscores or writingLikeThis.
the order of the recipes or ingredients also does not matter

```toml
[recipes]
# essentially means `product1 = item1 + item2`
product1 = ["item1", "item2"]

# Creating a new item thats neither product nor starting item
new_item = ["item2", "item3"]

# product2 = new_item + 2 item3's
product2 = ["new_item", "item3", "item3"]
```

If an item (except starting items) doesn't have a recipe associated, like our "product3",
then you will get an error (unless the item is never part of a tree).

This is what we've made so far, plus a recipe for "product3" so it doesn't error.

```toml
[io]
# Here we add our starting items (without it the program wouldn't do anything)
inputs = ["item1", "item2", "item3"]
# Here we add our products (without it the program wouldn't do anything)
products = ["product1", "product2", "product3"]


[recipes]
# essentially means `product1 = item1 + item2`
product1 = ["item1", "item2"]

# Creating a new item thats neither product nor starting item
new_item = ["item2", "item3"]

# product2 = new_item + 2 item3's
product2 = ["new_item", "item3", "item3"]

# item1 -> smelted_item
smelted_item = ["item1"]
# smelted_item -> product3
product3 = ["smelted_item"]
```

Bonus: Any items that are blue in the tree structure are starting items or the final item for that tree