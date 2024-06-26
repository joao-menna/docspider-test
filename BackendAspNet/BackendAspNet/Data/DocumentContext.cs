﻿using Microsoft.EntityFrameworkCore;

namespace BackendAspNet.Data
{
    public class DocumentContext : DbContext
    {
        public DocumentContext(DbContextOptions<DocumentContext> options) : base(options)
        {
        }

        public DbSet<Document> Documents { get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Document>().ToTable("document");
            modelBuilder.Entity<Document>().HasIndex(d => d.Title).IsUnique();
            modelBuilder.Entity<Document>().Property(d => d.CreatedAt).HasDefaultValueSql("NOW()");
        }
    }
}
