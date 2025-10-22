using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class SetMainPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            User? user = await userAccessor.GetUserWithPhotosAsync();
            Photo? photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);
            if (photo == null)
            {
                return Result<Unit>.Failure("Cannot find Photo", 400);
            }

            user.ImageUrl = photo.Url;
            bool result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem setting the main photo", 400);
        }
    }
}
