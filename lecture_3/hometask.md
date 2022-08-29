# Hometask 3
## Solve the task using Immutable.js. Do **not** use either Ramda or lodash/fp.

> Implement CRUD operations (only frontend, using global list) for the next entity:

    Book
    {
        title: string,
        author: string,
        publishingHouse: string,
        date: Date,
        tags: string[],
        isRead: boolean
    }

> Global storage should be implemented using one of the types from Immutable.js. Separate application into two layers: UI (subscriptions, DOM operations, etc.) and Business Layers (CRUD, filters). Create simple UI (list, details, several inputs and button) using plain JavaScript.
>
> Operations that should be implemented:
> - Show list
> - Add/Edit entity
> - Remove entity
> - Mark entity as read
> - Filter entities by author, tag, date
> - Filter entities that are already read
>
> Make sure you:
> - don't mutate any object. 
> - use functional approach (composition, partial application, pure functions).
> - separate your code base.
>
> Good luck!
