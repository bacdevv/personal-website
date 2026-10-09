---
title: "Java OOP for Beginners: Classes, Objects, and the Four Pillars"
description: Learn Java object-oriented programming step by step with clear
  examples of classes, encapsulation, inheritance, polymorphism, abstraction,
  and a small library project.
pubDatetime: 2026-10-09T03:00:00Z
draft: false
tags:
  - java
  - oop
  - programming
  - beginners
featured: false
---
# Java OOP for Beginners: Classes, Objects, and the Four Pillars

Java is an object-oriented programming language. That means we can organize a program around **objects** that contain both **data** (fields) and **behavior** (methods).

If you are new to Java, the terminology can feel overwhelming: classes, constructors, `this`, inheritance, interfaces, and more. This guide builds those ideas one at a time, then brings them together in a small library management program.

**What you will learn:**

- How classes and objects work in Java
- Why constructors, `this`, and access modifiers matter
- The four pillars of OOP: encapsulation, inheritance, polymorphism, and abstraction
- When to use interfaces and composition
- How to apply the concepts in a runnable mini-project

> **Prerequisite:** You should know basic Java syntax, variables, conditions, and loops. The examples work with Java 17 or later. Each standalone example should be saved in its own folder because several examples use a class named `Main`.

## 1. Classes and objects: the starting point

Imagine a student management application. Every student has an ID and a name, and each student can introduce themselves.

A **class** defines the structure and behavior. An **object** is a particular instance created from that class.

Create a file named `Student.java`:

```java
public class Student {
    private final String id;
    private String name;

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public void introduce() {
        System.out.println("Hi, I'm " + name + " (" + id + ")");
    }

    public static void main(String[] args) {
        Student student = new Student("S001", "Alex");
        student.introduce();
    }
}
```

Output:

```text
Hi, I'm Alex (S001)
```

Here is what matters:

- `Student` is the class.
- `id` and `name` are fields storing object data.
- `Student(String id, String name)` is a **constructor**, called when you use `new Student(...)`.
- `this.name` refers to the object's field, while `name` refers to the constructor parameter.
- `student` refers to an object; `student.introduce()` calls its method.

You can create many `Student` objects from the same class, each with its own state.

## 2. Pillar one: Encapsulation

**Encapsulation** means keeping an object's internal state under control and exposing operations that preserve valid data.

For example, a bank account should not allow arbitrary code to set its balance to a negative number. We make `balance` private and provide controlled methods instead.

Create `BankAccount.java`:

```java
public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount(100);
        account.deposit(50);
        System.out.println(account.getBalance());
    }
}
```

Output:

```text
150.0
```

Notice that there is no public `setBalance()` method. Not every private field needs a setter. Encapsulation is about **protecting rules**, not simply generating getters and setters for everything.

For real financial software, use `BigDecimal` or integer amounts representing the smallest currency unit instead of `double`. We use `double` here only to keep the OOP example focused.

## 3. Pillar two: Inheritance

**Inheritance** lets one class reuse and specialize another class's behavior. In Java, the keyword is `extends`.

A dog **is an** animal, so this is a natural relationship to model with inheritance.

Create `Main.java` in a new folder:

```java
class Animal {
    public void makeSound() {
        System.out.println("An animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.makeSound();
    }
}
```

Output:

```text
Woof!
```

`Dog` inherits from `Animal` but **overrides** `makeSound()` to provide a more specific implementation. `@Override` asks the compiler to verify that you are really overriding a superclass method.

Use inheritance when there is a genuine **is-a** relationship. Do not use it merely because two classes share a few fields.

## 4. Pillar three: Polymorphism

**Polymorphism** means we can use objects of different subclasses through one common parent type, while Java chooses the appropriate overridden method at runtime.

Update the previous `Main.java` example:

```java
class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animals = { new Dog(), new Cat() };

        for (Animal animal : animals) {
            animal.makeSound();
        }
    }
}
```

Output:

```text
Woof!
Meow!
```

The loop only knows that each variable has type `Animal`. It does not need to check whether an object is a `Dog` or a `Cat`. This is **runtime polymorphism**, also called dynamic method dispatch.

One important distinction:

- **Overriding:** a subclass replaces an inherited method with the same signature.
- **Overloading:** multiple methods share a name but have different parameter lists.

They are not the same concept.

## 5. Pillar four: Abstraction

**Abstraction** focuses on what an object can do without forcing users of that object to understand every implementation detail.

An **abstract class** can define shared behavior and require subclasses to implement missing behavior.

Create `Main.java` in another folder:

```java
abstract class Shape {
    public abstract double area();
}

class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape shape = new Circle(2);
        System.out.printf("Area: %.2f%n", shape.area());
    }
}
```

Output:

```text
Area: 12.57
```

You cannot create `new Shape()` because it is abstract. But you **can** declare a variable of type `Shape` and store a `Circle` object in it.

### Abstract class versus interface

An **interface** describes a contract: classes that implement it promise to provide certain behavior.

```java
interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    @Override
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

public class Main {
    public static void main(String[] args) {
        Notifier notifier = new EmailNotifier();
        notifier.send("Welcome!");
    }
}
```

An abstract class is useful for a shared base with state or common implementation. An interface is useful for describing a capability that different classes may provide. Java classes can extend only one class, but they can implement multiple interfaces.

## 6. Composition: the other relationship you should know

Not every relationship is inheritance. A library **has a collection of** books; it is not a kind of book. This is **composition**: building a class by including other objects.

```java
import java.util.ArrayList;
import java.util.List;

class Library {
    private final List<String> bookTitles = new ArrayList<>();

    public void addBook(String title) {
        bookTitles.add(title);
    }

    public int countBooks() {
        return bookTitles.size();
    }
}

public class Main {
    public static void main(String[] args) {
        Library library = new Library();
        library.addBook("Effective Java");
        System.out.println(library.countBooks());
    }
}
```

Output:

```text
1
```

A useful rule of thumb: use **inheritance** for a meaningful *is-a* relationship and consider **composition** for *has-a* relationships. In many designs, composition keeps classes easier to change.

## 7. Mini-project: A library catalog using OOP

Let's connect the concepts in a small, complete program. Save the following as `Main.java`:

```java
import java.util.ArrayList;
import java.util.List;

interface Borrowable {
    int loanDays();
}

abstract class LibraryItem implements Borrowable {
    private final String title;

    protected LibraryItem(String title) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public abstract String getCategory();
}

class Book extends LibraryItem {
    public Book(String title) {
        super(title);
    }

    @Override
    public String getCategory() {
        return "Book";
    }

    @Override
    public int loanDays() {
        return 14;
    }
}

class Magazine extends LibraryItem {
    public Magazine(String title) {
        super(title);
    }

    @Override
    public String getCategory() {
        return "Magazine";
    }

    @Override
    public int loanDays() {
        return 7;
    }
}

class Library {
    private final List<LibraryItem> items = new ArrayList<>();

    public void addItem(LibraryItem item) {
        if (item == null) {
            throw new IllegalArgumentException("Item cannot be null");
        }
        items.add(item);
    }

    public void printCatalog() {
        for (LibraryItem item : items) {
            System.out.printf(
                "%s: %s (%d-day loan)%n",
                item.getCategory(),
                item.getTitle(),
                item.loanDays()
            );
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Library library = new Library();
        library.addItem(new Book("Effective Java"));
        library.addItem(new Magazine("Java Monthly"));
        library.printCatalog();
    }
}
```

Run it:

```bash
javac Main.java
java Main
```

Expected output:

```text
Book: Effective Java (14-day loan)
Magazine: Java Monthly (7-day loan)
```

### Where is OOP in this example?


| Concept | Where you can see it |
| ---------------- | -------------------------------------------------------------------- |
| Class and object | `new Book(...)`, `new Magazine(...)`, `new Library()` |
| Encapsulation | Private `title` and private `items` list |
| Inheritance | `Book extends LibraryItem` |
| Polymorphism | `List<LibraryItem>` calls overridden methods on different item types |
| Abstraction | `abstract class LibraryItem` and `interface Borrowable` |
| Composition | `Library` contains a list of `LibraryItem` objects |


Notice that `Library` does not need a separate loop for books and magazines. It processes both through the shared `LibraryItem` type. That is a practical benefit of polymorphism.

## 8. Common beginner mistakes

**Making every field public.** Start with private fields and expose methods that represent meaningful operations.

**Confusing a class with an object.** `Book` is a class; `new Book("Effective Java")` creates an object.

**Using `==` to compare String values.** Use `a.equals(b)` for content comparison when `a` is non-null, or `Objects.equals(a, b)` when either value may be null.

**Confusing overriding and overloading.** Overriding changes inherited behavior; overloading changes the accepted parameter list.

**Using inheritance for every relationship.** A `Library` has books; it should not extend `Book`.

**Forgetting constructors and object initialization.** Before calling methods on an object reference, make sure it refers to an actual object rather than `null`.

## 9. Practice challenges

Try these exercises without copying the solution:

1. Add a `ReferenceBook` class to the mini-project. It should extend `LibraryItem` and allow a 3-day loan.
2. Add `findItemByTitle(String title)` to `Library`. Return the matching `LibraryItem`, or `null` if none is found.
3. Prevent duplicate titles when calling `addItem()`.
4. Add `removeItemByTitle(String title)` and return `true` only if an item was removed.
5. Explain in your own words why `Library` stores `List<LibraryItem>` instead of `List<Book>`.

If you can complete the first two exercises and explain the fifth, you have understood the foundation of Java OOP rather than simply memorizing definitions.

## Final takeaway

Object-oriented programming is not about making code complicated. It is about giving each part of a program a clear responsibility.

Start with **classes and objects**. Protect state through **encapsulation**. Reuse meaningful base types with **inheritance**. Write flexible code through **polymorphism**. Express shared contracts with **abstraction** and interfaces. Finally, use **composition** to connect objects into useful systems.

The best next step is to build a small application—such as a student manager, library manager, or movie-ticket system—and deliberately identify where each concept appears in your own code.