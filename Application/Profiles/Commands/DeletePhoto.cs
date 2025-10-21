using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class DeletePhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor, IPhotoService photoService) :
        IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            User? user = await userAccessor.GetUserWithPhotosAsync();
            Photo? photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);
            if (photo == null)
            {
                return Result<Unit>.Failure("Cannot find Photo", 400);
            }

            if (photo.Url == user.ImageUrl)
            {
                return Result<Unit>.Failure("cannot delete main Photo", 400);
            }
            
            await photoService.DeletePhoto(photo.PublicId);
            user.Photos.Remove(photo);
            bool result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleteing photo", 400);
        }
    }
}
