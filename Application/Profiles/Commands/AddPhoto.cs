using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class AddPhoto
{
    public class Command : IRequest<Result<Photo>>
    {
        public required IFormFile File { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context, IPhotoService photoService) : 
        IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            PhotoUploadResult? uploadResult = await photoService.UploadPhoto(request.File);
            if (uploadResult == null)
            {
                return Result<Photo>.Failure("Failed to upload photo", 400);
            }

            User? user = await userAccessor.GetUserAsync();
            Photo photo = new()
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id
            };

            // if image url is null, set it to the photo url
            user.ImageUrl ??= photo.Url;

            context.Photos.Add(photo);
            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem saving photo to DB", 400);
        }
    }
}
