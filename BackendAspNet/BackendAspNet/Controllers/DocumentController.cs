using BackendAspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace BackendAspNet.Controllers
{
    [ApiController]
    [Route("documents")]
    public class DocumentController : ControllerBase
    {
        private readonly DocumentContext _context;
        public DocumentController(DocumentContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocuments()
        {
            return await _context.Documents.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetDocument(int id)
        {
            var product = await _context.Documents.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Document>> InsertDocument(Document document)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "static");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            if (document.File != null)
            {
                var fs = new FileStream(Path.Combine(path, document.FileName), FileMode.OpenOrCreate);
                var file = Convert.FromBase64String(document.File);
                fs.Write(file, 0, file.Length);
                fs.Close();
            }
            
            return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(int id, Document document)
        {
            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool DocumentExists(int id)
        {
            return _context.Documents.Any(e => e.Id == id);
        }
    }
}