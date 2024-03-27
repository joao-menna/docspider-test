namespace BackendAspNet
{
    public class DocumentInsert
    {
        public IFormFile File {  get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FileName {  get; set; }
    }
}
