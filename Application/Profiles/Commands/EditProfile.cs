using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class EditProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditProfileDto EditProfileDto { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context) :
        IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            User? user = await userAccessor.GetUserAsync();
            user.Bio = request.EditProfileDto.Bio;
            user.DisplayName = request.EditProfileDto.DisplayName;
            context.Entry(user).State = EntityState.Modified;
            bool result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem editing the user profile", 400);
        }
    }
}
