using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAspNet.Migrations
{
    public partial class DocumentTitleAddUnique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_document_Title",
                table: "document",
                column: "Title",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_document_Title",
                table: "document");
        }
    }
}
