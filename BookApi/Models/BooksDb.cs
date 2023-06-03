using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookApi.Models
{
    public class BooksDb
    {
        public int Id { get; set; }
        [Column("Book Title")]
        public string? Title { get; set; }
        [Column("Publication Year")]
        public int? PublicationYear { get; set; }
        [Column("Book Score")]
        [Precision(18, 2)] // <-- added this attribute
        public decimal? Score { get; set; }
        [Column("Book Author")]
        public string? Author { get; set; }
        [Column("Cover Image")]
        public string? Image { get; set; }
        [Column("Review Text")]
        public string? ReviewText { get; set; }
    }
}
