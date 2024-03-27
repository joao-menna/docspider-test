using System.ComponentModel.DataAnnotations;

namespace BackendAspNet
{
    public class Document
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string FileName { get; set; }

        public string? File { get; set; }
    }
}