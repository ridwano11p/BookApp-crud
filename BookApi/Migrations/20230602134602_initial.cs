using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookApi.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookTitle = table.Column<string>(name: "Book Title", type: "nvarchar(max)", nullable: true),
                    PublicationYear = table.Column<int>(name: "Publication Year", type: "int", nullable: true),
                    BookScore = table.Column<decimal>(name: "Book Score", type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    BookAuthor = table.Column<string>(name: "Book Author", type: "nvarchar(max)", nullable: true),
                    CoverImage = table.Column<string>(name: "Cover Image", type: "nvarchar(max)", nullable: true),
                    ReviewText = table.Column<string>(name: "Review Text", type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
