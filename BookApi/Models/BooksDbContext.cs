using Microsoft.EntityFrameworkCore; // This namespace contains classes for working with Entity Framework Core
using System.Collections.Generic;

namespace BookApi.Models
{
    public class BooksDbContext : DbContext // This class inherits from the DbContext class
    {
        public BooksDbContext(DbContextOptions<BooksDbContext> options) : base(options) // This is the constructor that takes the options parameter and passes it to the base class
        {
            // You can add any initialization logic here
        }

        public DbSet<BooksDb> Books { get; set; } // This property represents the table of books in the database
    }
}
