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

            var oldFileName = foundDocument.FileName;
            foundDocument.Title = document.Title;
            foundDocument.Description = document.Description;
            foundDocument.FileName = document.FileName;

            var staticPath = Path.Combine(Directory.GetCurrentDirectory(), "static");

            _context.Entry(foundDocument).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                var file = new FileInfo(Path.Combine(staticPath, oldFileName));
                file.MoveTo(Path.Combine(staticPath, document.FileName));
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

            var oldFileName = document.FileName;

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            var staticPath = Path.Combine(Directory.GetCurrentDirectory(), "static");
            var file = new FileInfo(Path.Combine(staticPath, oldFileName));
            file.Delete();

            return NoContent();
        }

        private bool DocumentExists(int id)
        {
            return _context.Documents.Any(e => e.Id == id);
        }
    }
}