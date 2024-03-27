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
            var document = await _context.Documents.FindAsync(id);

            if (document == null)
            {
                return NotFound();
            }

            return document;
        }

        [HttpPost]
        public async Task<ActionResult<Document>> InsertDocument([FromForm] DocumentInsert document)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "static");

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            var newDocument = new Document();
            newDocument.Title = document.Title;
            newDocument.Description = document.Description;
            newDocument.FileName = document.FileName;

            _context.Documents.Add(newDocument);
            await _context.SaveChangesAsync();

            var fs = new FileStream(Path.Combine(path, document.FileName), FileMode.OpenOrCreate);
            await document.File.CopyToAsync(fs);
            fs.Close();
            
            return CreatedAtAction(nameof(GetDocument), new { id = newDocument.Id }, newDocument);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(int id, Document document)
        {
            var foundDocument = await _context.Documents.FindAsync(id);

            if (foundDocument == null)
            {
                return NotFound();
            }

            foundDocument.Title = document.Title;
            foundDocument.Description = document.Description;
            foundDocument.FileName = document.FileName;

            _context.Entry(foundDocument).State = EntityState.Modified;

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

        [HttpDelete("{id}")]
        public async Task<ActionResult<Document>> DeleteDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);

            if (document == null)
            {
                return NotFound();
            }

            
        }

        private bool DocumentExists(int id)
        {
            return _context.Documents.Any(e => e.Id == id);
        }
    }
}